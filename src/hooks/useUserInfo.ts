import { reqHandler } from "@/lib/requests/server/base";
import { useState, useEffect } from "react";
import { GET_USER_INFO_URI } from "@/hooks/base";

interface UserInfo {
  data: {
    user: {
      id: string;
      name: string;
      image: string;
      email: string;
      email_verified: boolean;
      created_at: string;
    }
  };
  elapsed: number;
  message: string;
  status: number;
  uri: string;
}

// interface User {
//   id: string;
//   name: string;
//   image: string;
//   email: string;
//   email_verified: boolean;
//   created_at: string;
// }

interface UserError {
  error: string;
  message: string;
  isAuthFail: boolean;
}

export function useUserInfo() {
  const [userInfo, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<UserError | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await reqHandler.get<UserInfo>(GET_USER_INFO_URI);
        setUser(userData.data as UserInfo);
      } catch (err) {
        setError(err as UserError);
      }
    };
    fetchUser().catch(err => {
      console.error("Failed to fetch user:", err);
      setError(err as UserError);
    });
}, []);

  return { userInfo, error };
}
