import {reqHandler} from "@/lib/requests/client/base";

const CREDENTIALS_PROVIDER = "credentials";

export interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  email_verified: boolean;
  created_at: string;
}

interface UserResponse {
  uri: string;
  elapsed: number;
  status: number;
  message: string;
  data: {
    user: User;
  };
}

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

/**
 * Get user information.
 * @returns - A promise that resolves to the user information.
 * @throws - An error if the request fails.
 */
export async function getUserInfo(): Promise<User> {
  try {
    const response = await fetch('/api/v1/user/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store your auth token in localStorage
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: UserResponse = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}



