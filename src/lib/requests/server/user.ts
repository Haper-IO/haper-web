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

