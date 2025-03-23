import { reqHandler } from "@/lib/requests/server/base";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  email_verified: boolean;
  created_at: string;
}

interface UserError {
  error: string;
  message: string;
  isAuthFail: boolean;
}

export function useUserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<UserError | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await reqHandler.get<User>("/user/info");
        setUser(userData.data as User);
      } catch (err) {
        setError(err as UserError);
      }
    };
    fetchUser().catch(err => {
      console.error("Failed to fetch user:", err);
      setError(err as UserError);
    });
}, []);

  return { user, error };
}
