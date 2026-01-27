import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getAccessToken, getAuthData } from "@/api/axios-config";

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      clearUser();
      return;
    }

    const authData = getAuthData();
    const user = authData?.user;
    if (!user?.id) {
      clearUser();
      return;
    }

    setUser({
      id: user.id,
      email: user.email ?? user.user_metadata?.email,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role,
    });
  }, [clearUser, setUser]);
}
