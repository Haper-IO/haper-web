import {reqHandler} from "@/lib/requests/server/base";

/**
 * Start message tracking with a new account
 *
 * @param provider - The OAuth provider.
 * @param providerAccountID - The user account ID of the corresponding OAuth provider.
 * @param accessToken - The access token of the OAuth provider.
 * @param refreshToken - The refresh token of the OAuth provider.
 * @param expiresAt - The Unix time when the access token will expire.
 * @param email - The email of the user.
 * @param cookies The cookie from the client side passed to the server.
 * @returns - A promise that resolves to the tracking information.
 */
export const startMessageTrackingWithNewAccount = async (
  {
    provider,
    providerAccountID,
    accessToken,
    refreshToken,
    expiresAt,
    email
  }: {
    provider: string,
    providerAccountID: string,
    accessToken: string,
    refreshToken?: string,
    expiresAt?: number,
    email?: string,
  }, cookies: string) => {
  return reqHandler.post(`/message/tracking/start`, {
    account: {
      provider,
      provider_account_id: providerAccountID,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      email
    }
  }, {
    headers: {
      Cookie: cookies
    }
  })
}
