"use client";

function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)rosey-auth=([^;]*)/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return parsed?.access_token ?? null;
  } catch {
    return null;
  }
}

export function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = getAccessToken();
  return fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
