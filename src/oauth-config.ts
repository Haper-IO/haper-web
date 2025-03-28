import {Google} from "@/lib/oauth/providers/google";
import {OAuthProvider} from "@/lib/oauth/providers/base";
import {Microsoft} from "@/lib/oauth/providers/microsoft";

declare global {
  // eslint-disable-next-line no-var
  var oauthClients: { [provider: string]: OAuthProvider }  | undefined;
}

export const oauthClients = globalThis.oauthClients || {
  "google": new Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    codeVerifier: process.env.OAUTH_CODE_VERIFIER!,
    scopes: ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.modify"],
    searchParams: {
      "prompt": "consent",
      "access_type": "offline",
    }
  }),
  "microsoft": new Microsoft({
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    codeVerifier: process.env.OAUTH_CODE_VERIFIER!,
    scopes: ["email", "Mail.ReadWrite", "Mail.Send", "offline_access", "openid", "profile", "User.READ"],
  })
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.oauthClients = oauthClients
}
