import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/server/supabase-client";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin | Rosey",
  robots: { index: false, follow: false },
};

async function getAdminUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("rosey-auth")?.value;
  if (!raw) return null;

  let accessToken: string | null = null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    accessToken = parsed?.access_token ?? null;
  } catch {
    return null;
  }

  if (!accessToken) return null;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) return null;

  return data.user.user_metadata?.role === "admin" ? data.user : null;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/");

  return (
    <div className="flex h-screen overflow-hidden bg-primary-bg text-primary-text">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
