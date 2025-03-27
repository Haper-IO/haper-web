import { useState, useEffect } from "react";
import { getUserInfo, UserInfo } from "@/lib/requests/client/user-info";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        console.log('Fetching user info...');
        setLoading(true);
        const response = await getUserInfo();
        console.log('User info response:', response);
        
        // The reqHandler.interceptors.response already transforms the response
        // to response.data.data, so we just need to check if we have user
        if (response && response.user) {
          if (mounted) {
            setUserInfo({
              uri: '',
              elapsed: 0,
              status: 0,
              message: '',
              data: {
                user: response.user
              }
            });
            setLoading(false);
          }
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch user info'));
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { userInfo, loading, error };
}
