import {reqHandler} from "@/lib/requests/client/base";

const CREDENTIALS_PROVIDER = "credentials";

/**
 * Log in a user by email and password.
 *
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns - A promise that resolves to the user information.
 */
export const loginByCredential = async (email: string, password: string) => {
  return reqHandler.post(`/user/login`, {
    provider: CREDENTIALS_PROVIDER,
    email,
    password,
  })
}

/**
 * Sign up a user by email and password.
 * @param name - The username of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns - A promise that resolves to the user information.
 */
export const signupByCredential = async (name: string, email: string, password: string) => {
  return reqHandler.post(`/user/signup`, {
    provider: CREDENTIALS_PROVIDER,
    name,
    email,
    password
  })
}
