import {useState, useEffect} from "react";
import {getUserInfo, UserInfo} from "@/lib/requests/client/user-info";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
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
