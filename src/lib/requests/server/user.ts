import {reqHandler} from "@/lib/requests/server/base";


/**
 * Log in a user by OAuth
 *
 * @param provider - The oauth provider.
 * @param email - The email of the oauth provider.
 * @param providerAccountID - The user account id of corresponding oauth provider.
 * @param accessToken - The access token of oauth provider.
 * @param refreshToken - The refresh token of oath provider.
 * @param expiresAt - The unix time of when will the access token expire.
 * @returns - A promise that resolves to the user information.
 */
export const loginByOAuth = async (
  {
    provider,
    email,
    providerAccountID,
    accessToken,
    refreshToken,
    expiresAt,
  }: {
    provider: string,
    email: string,
    providerAccountID: string,
    accessToken: string,
    refreshToken?: string,
    expiresAt?: number,
  }) => {
  return reqHandler.post(`/user/login`, {
    provider,
    email,
    provider_account_id: providerAccountID,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  })
}

/**
 * Sign up a user by OAuth
 *
 * @param provider - The oauth provider.
 * @param email - The email of the oauth provider.
 * @param name - The username returned the oauth provider.
 * @param image - The user portrait image returned oauth provider.
 * @param providerAccountID - The user account id of corresponding oauth provider.
 * @param accessToken - The access token of oauth provider.
 * @param refreshToken - The refresh token of oath provider.
 * @param expiresAt - The unix time of when will the access token expire.
 * @returns - A promise that resolves to the user information.
 */
export const signupByOAuth = async (
  {
    provider,
    email,
    name,
    image,
    providerAccountID,
    accessToken,
    refreshToken,
    expiresAt,
  }: {
    provider: string,
    email: string,
    name?: string,
    image?: string,
    providerAccountID: string,
    accessToken: string,
    refreshToken?: string,
    expiresAt?: number,
  }) => {
  return reqHandler.post(`/user/signup`, {
    provider,
    email,
    name,
    image,
    provider_account_id: providerAccountID,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  })
}

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
    provider,
    provider_account_id: providerAccountID,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
    email
  }, {
    headers: {
      "Cookie": cookies
    }
  })
}
