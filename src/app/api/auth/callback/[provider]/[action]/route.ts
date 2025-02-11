import {redirect} from 'next/navigation'
import {NextRequest, NextResponse} from "next/server";
import {loginByOAuth, signupByOAuth} from "@/lib/requests/server/user";
import {oauthClients} from "@/oauth-config";
import {ActionType, OAuthError} from "@/lib/oauth/types";
import {AxiosError} from "axios";

export async function GET(
  req: NextRequest,
  {params}: { params: Promise<{ provider: string, action: string }> },
) {
  const {searchParams} = req.nextUrl
  const {provider, action} = await params
  const proto = req.headers.get("x-forwarded-proto") || "http";  // Default to 'http' if not found
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host")

  const client = oauthClients[provider]
  if (!client) {
    return redirect("/error?error_msg=unknown provider")
  }

  const scope = searchParams.get('scope')
  if (!scope) {
    return redirect("/error?error_msg=missing_scope")
  }

  if (client.verifyScopes(scope.split(' ')) === false) {
    return redirect("/error?error_msg=please make sure choose all necessary permission")
  }

  const code = searchParams.get('code')
  if (!code) {
    return redirect("/error?error_msg=missing_code")
  }

  try {
    // exchange code for token
    const tokens = await client.getToken(action as ActionType, code);
    const accessToken = tokens.accessToken();
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    let refreshToken: string | undefined = undefined;
    if (tokens.hasRefreshToken()) {
      refreshToken = tokens.refreshToken();
    }

    const userProfile = await client.getProfile(accessToken);

    if (action === 'login') {
      const response = await loginByOAuth({
        provider,
        email: userProfile.email,
        providerAccountID: userProfile.accountId,
        accessToken,
        expiresAt: Math.floor(accessTokenExpiresAt.getTime() / 1000),
        refreshToken,
      })
      const resp = NextResponse.redirect(new URL("/dashboard", `${proto}://${host}`))
      if (response.headers["set-cookie"]) {
        for (const cookie of response.headers["set-cookie"]) {
          resp.headers.append("Set-Cookie", cookie)
        }
      }
      return resp
    } else if (action === 'signup') {
      const response = await signupByOAuth({
        provider,
        email: userProfile.email,
        name: userProfile.name,
        image: userProfile.picture,
        providerAccountID: userProfile.accountId,
        accessToken,
        expiresAt: Math.floor(accessTokenExpiresAt.getTime() / 1000),
        refreshToken,
      })
      const resp = NextResponse.redirect(new URL("/dashboard", `${proto}://${host}`))
      if (response.headers["set-cookie"]) {
        for (const cookie of response.headers["set-cookie"]) {
          resp.headers.append("Set-Cookie", cookie)
        }
      }
      return resp
    } else {
      throw new Error("unknown action")
    }

  } catch (e) {
    if (e instanceof OAuthError) {
      return redirect(`/error?error_msg=${e.message}`)
    } else if (e instanceof AxiosError) {
      if (e.response && e.response.data && e.response.data.message
        && e.response.data.status && e.response.data.status != 9999) {
        return redirect(`/error?error_msg=${e.response.data.message}`)
      } else {
        console.error(e)
        return redirect(`/error?error_msg=unknown error happened when request backend`)
      }
    } else if (e instanceof Error) {
      console.error(e)
      return redirect(`/error?error_msg=${e.message}`)
    } else {
      return redirect(`/error?error_msg=unknown error happened`)
    }
  }
}
