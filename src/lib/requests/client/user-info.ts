import {reqHandler} from "./base";

export interface UserInfo {
  id: string;
  name: string;
  image: string;
  email: string;
  email_verified: boolean;
  created_at: string;
}

/**
 * Get current user information.
 *
 * @returns - A promise that resolves to the user information.
 */
export const getUserInfo = async () => {
  return reqHandler.get('/user/info');
};
