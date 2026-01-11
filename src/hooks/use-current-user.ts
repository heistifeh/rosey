import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getAccessToken, getAuthData } from "@/api/axios-config";

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const token = getAccessToken();
  const authData = getAuthData();

  useEffect(() => {
    if (!token) {
      clearUser();
      return;
    }

    const user = authData?.user;
    if (!user?.id) {
      clearUser();
      return;
    }

    setUser({
      id: user.id,
      email: user.email ?? user.user_metadata?.email,
      name: user.user_metadata?.name,
    });
  }, []);
}
