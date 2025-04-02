import * as arctic from "arctic";
import {redirect} from "next/navigation";
import {OAuthProvider} from "@/lib/oauth/providers/base";
import {ActionType, OAuthError, OAuthProviderConfig, Profile} from "@/lib/oauth/types";

const userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";

export class Google extends OAuthProvider {
  private loginRedirectUrl: string = "/api/auth/callback/google/login"
  private signupRedirectUrl: string = "/api/auth/callback/google/signup"
  private authorizeRedirectUrl: string = "/api/auth/callback/google/authorize"

  constructor(options: OAuthProviderConfig) {
    super(options)
  }

  private async constructClient(action: ActionType) {
    let redirectUrl: string;
    switch (action) {
      case "login":
        redirectUrl = new URL(this.loginRedirectUrl, this.options.originUrl).toString();
        break;
      case "signup":
        redirectUrl = new URL(this.signupRedirectUrl, this.options.originUrl).toString();
        break;
      case "authorize":
        redirectUrl = new URL(this.authorizeRedirectUrl, this.options.originUrl).toString();
        break;
    }
    return new arctic.Google(this.options.clientId, this.options.clientSecret, redirectUrl);
  }

  private async redirectOAuthUrl(action: ActionType) {
    const client = await this.constructClient(action);
    const url = client.createAuthorizationURL(
      arctic.generateState(),
      this.options.codeVerifier,
      this.options.scopes ?? [],
    )
    if (this.options.searchParams) {
      for (const [key, value] of Object.entries(this.options.searchParams)) {
        url.searchParams.set(key, value)
      }
    }
    return redirect(url.toString());
  }

  public override async getToken(action: ActionType, code: string): Promise<arctic.OAuth2Tokens> {
    const client = await this.constructClient(action);
    try {
      return await client.validateAuthorizationCode(code, this.options.codeVerifier)
    } catch (e) {
      console.error(e)
      throw new OAuthError("exchange token for code failed")
    }
  }

  public override async getProfile(accessToken: string): Promise<Profile> {
    const response = await fetch(userInfoEndpoint, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new OAuthError(
        `Token refresh failed: ${response.status} ${response.statusText}` +
        (errorData ? `\nDetails: ${JSON.stringify(errorData)}` : '')
      );
    }

    const responseJson = await response.json();
    return {
      accountId: responseJson.sub,
      email: responseJson.email,
      name: responseJson.name,
      picture: responseJson.picture,
    }
  }

  public override async login() {
    return this.redirectOAuthUrl("login");
  }

  public override async signup() {
    return this.redirectOAuthUrl("signup");
  }

  public override async authorize() {
    return this.redirectOAuthUrl("authorize");
  }
}
