import {headers} from "next/headers";
import * as arctic from "arctic";
import {ActionType, OAuthProviderConfig, Profile} from "@/lib/oauth/types";

export async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export class OAuthProvider {
  options: OAuthProviderConfig

  constructor(options: OAuthProviderConfig) {
    this.options = options
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getToken(action: ActionType, code: string): Promise<arctic.OAuth2Tokens> {
    throw "Not implemented";
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getProfile(accessToken: string): Promise<Profile> {
  }

  public async login() {
    throw "Not implemented";
  }

  public async signup() {
    throw "Not implemented";
  }

  public async authorize() {
    throw "Not implemented";
  }

  public verifyScopes(scopes: string[]): boolean {
    for (const scope of this.options.scopes ?? []) {
      if (!scopes.includes(scope)) {
        return false
      }
    }
    return true
  }
}
