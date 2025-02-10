import * as arctic from "arctic";

import { redirect } from 'next/navigation'
import {NextRequest, NextResponse} from "next/server";
import {loginByOAuth, signupByOAuth} from "@/lib/requests/server/user";
import {codeVerifier} from "@/auth-config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string, action: string }> },
) {
  const {protocol, host, pathname, searchParams} = request.nextUrl
  const {provider, action} = await params


  const scope = searchParams.get('scope')
  if (!scope) {
    return redirect("/error?error_msg=missing_scope")
  }

  const code = searchParams.get('code')
  if (!code) {
    return redirect("/error?error_msg=missing_code")
  }

  const scopeList = scope.split(' ')
  if (!scopeList.includes("https://www.googleapis.com/auth/gmail.modify")) {
    return redirect("/error?error_msg=please make sure choose permission for gmail access")
  }

  const callbackUrl = `${protocol}//${host}${pathname}`
  try {
    // exchange code for token
    const google = new arctic.Google(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      callbackUrl
    );

    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    let refreshToken: string | undefined = undefined;
    if (tokens.hasRefreshToken()) {
      refreshToken = tokens.refreshToken();
    }

    // get user info
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Token refresh failed: ${response.status} ${response.statusText}` +
        (errorData ? `\nDetails: ${JSON.stringify(errorData)}` : '')
      );
    }

    const userProfile = await response.json();

    if (action === 'login') {
      const response = await loginByOAuth({
        provider,
        email: userProfile.email,
        providerAccountID: userProfile.sub,
        accessToken,
        expiresAt: Math.floor(accessTokenExpiresAt.getTime() / 1000),
        refreshToken,
      })
      if (response.status === 200) {
        const resp = NextResponse.redirect(new URL("/dashboard", request.url))
        if (response.headers["set-cookie"]) {
          resp.headers.set("Set-Cookie", response.headers["set-cookie"].join(", "))
        }
        return resp
      } else {
        if (response.data && response.data.message) {
          throw new Error(response.data.message)
        }
        throw new Error("unknown error happened")
      }
    } else if (action === 'signup') {
      const response = await signupByOAuth({
        provider,
        email: userProfile.email,
        name: userProfile.name,
        image: userProfile.picture,
        providerAccountID: userProfile.sub,
        accessToken,
        expiresAt: Math.floor(accessTokenExpiresAt.getTime() / 1000),
        refreshToken,
      })
      if (response.status === 200) {
        const resp = NextResponse.redirect(new URL("/dashboard", request.url))
        if (response.headers["set-cookie"]) {
          resp.headers.set("Set-Cookie", response.headers["set-cookie"].join(", "))
        }
        return resp
      } else {
        if (response.data && response.data.message) {
          throw new Error(response.data.message)
        }
        throw new Error("unknown error happened")
      }
    } else {
      throw new Error("unknown action")
    }

  } catch (e) {
    if (e instanceof arctic.OAuth2RequestError) {
      console.error(e)
      return redirect("/error?error_msg=change code for access token failed")
    } else {
      console.error(e)
      return redirect("/error?error_msg=unknown error happened")
    }
  }
}
