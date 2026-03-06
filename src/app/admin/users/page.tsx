"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { ShieldOff, ShieldCheck, RefreshCw, Search } from "lucide-react";

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  banned_until?: string;
  user_metadata?: { role?: string };
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "danger" | "warning" }) {
  const cls = {
    default: "bg-dark-surface text-text-gray-opacity",
    success: "bg-green-900/40 text-green-400",
    danger: "bg-rose-900/40 text-rose-400",
    warning: "bg-yellow-900/40 text-yellow-400",
  }[variant];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      const res = await adminFetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (userId: string, action: "disable" | "enable") => {
    setActing(userId);
    try {
      const res = await adminFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) throw new Error("Action failed");
      toast.success(action === "disable" ? "User disabled" : "User enabled");
      await fetchUsers();
    } catch {
      toast.error("Action failed");
    } finally {
      setActing(null);
    }
  };

  const isBanned = (user: AuthUser) => {
    if (!user.banned_until) return false;
    return new Date(user.banned_until) > new Date();
  };

  const fmt = (val?: string) =>
    val ? new Date(val).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Users</h1>
          <p className="text-sm text-text-gray-opacity mt-1">{total} total auth users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 rounded-xl border border-dark-border px-3 py-2 text-sm text-text-gray-opacity hover:text-primary-text hover:bg-dark-surface transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-gray-opacity pointer-events-none" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-dark-border bg-input-bg pl-9 pr-4 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary"
        />
      </div>

      <div className="rounded-2xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-surface border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Last Sign In</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-dark-surface animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-gray-opacity">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-dark-surface/40 transition-colors">
                  <td className="px-4 py-3 text-primary-text font-medium">{user.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.user_metadata?.role === "admin" ? "warning" : "default"}>
                      {user.user_metadata?.role ?? "user"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">{fmt(user.created_at)}</td>
                  <td className="px-4 py-3 text-text-gray-opacity">{fmt(user.last_sign_in_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={isBanned(user) ? "danger" : "success"}>
                      {isBanned(user) ? "Disabled" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.user_metadata?.role !== "admin" && (
                      isBanned(user) ? (
                        <button
                          onClick={() => handleAction(user.id, "enable")}
                          disabled={acting === user.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors disabled:opacity-50"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Enable
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(user.id, "disable")}
                          disabled={acting === user.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 transition-colors disabled:opacity-50"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          Disable
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="flex items-center justify-between text-sm text-text-gray-opacity">
          <span>Page {page} · {total} users</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={users.length < 50}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
