import { reqHandler } from "./base";

export interface UserInfo {
  uri: string;
  elapsed: number;
  status: number;
  message: string;
  data:{
    user:{
      id: string;
      name: string;
      image: string;
      email: string;
      email_verified: boolean;
      created_at: string;
    }
  }
}

/**
 * Get current user information.
 *
 * @returns - A promise that resolves to the user information.
 */
export const getUserInfo = async () => {
  console.log('Making getUserInfo request...'); // Debug log
  try {
    const response = await reqHandler.get('/user/info');
    console.log('getUserInfo response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('getUserInfo error:', error); // Debug log
    throw error;
  }
};
