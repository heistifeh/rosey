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

    const cookieAppRole =
      user.user_metadata?.role ??
      user.app_metadata?.role ??
      (typeof user.user_metadata?.profile_type === "string"
        ? user.user_metadata.profile_type.toLowerCase()
        : undefined);
    const supabaseRole =
      typeof user.role === "string" ? user.role.toLowerCase() : undefined;
    const inferredRole =
      cookieAppRole ??
      (supabaseRole && supabaseRole !== "authenticated" && supabaseRole !== "anon"
        ? supabaseRole
        : undefined);

    setUser({
      id: user.id,
      email: user.email ?? user.user_metadata?.email,
      name: user.user_metadata?.name,
      role: inferredRole,
    });
  }, [clearUser, setUser]);
}
