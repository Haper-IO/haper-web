import * as arctic from "arctic";

export class OAuthError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Fix prototype chain
  }
}

export interface Profile {
  accountId: string;
  email: string;
  name: string;
  picture: string | undefined;
}

export interface OAuthProviderConfig {
  originUrl: string;
  clientId: string;
  clientSecret: string;
  codeVerifier: string;
  scopes?: string[];
  searchParams?: { [key: string]: string };
}

export type ActionType = "login" | "signup" | "authorize"

export interface OAuthCallback {
  login?: (params: { provider: string, token: arctic.OAuth2Tokens, profile: Profile }) => Promise<void>
  signup?: (params: { provider: string, token: arctic.OAuth2Tokens, profile: Profile }) => Promise<void>
  authorize?: (params: { provider: string, token: arctic.OAuth2Tokens, profile: Profile }) => Promise<void>;
}
