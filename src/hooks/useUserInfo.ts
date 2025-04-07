import {getUserInfo, User} from "@/lib/requests/client/user";
import {useState, useEffect} from "react";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      getUserInfo().then((resp) => {
        setUserInfo(resp.data.user)
      }).finally(() => {
        setLoading(false);
      })
    }
    fetchData();
  }, []);

  return {userInfo, loading};
}
