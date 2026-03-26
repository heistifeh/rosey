"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { RefreshCw, ExternalLink, Eye, EyeOff } from "lucide-react";

interface AdminProfile {
  id: string;
  user_id?: string;
  working_name?: string;
  username?: string;
  city?: string;
  country?: string;
  approval_status?: string;
  is_fully_verified: boolean;
  is_active: boolean;
  profile_type?: string;
  contact_email?: string;
  created_at: string;
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "danger" | "warning" | "info" }) {
  const cls = {
    default: "bg-dark-surface text-text-gray-opacity",
    success: "bg-green-900/40 text-green-400",
    danger: "bg-rose-900/40 text-rose-400",
    warning: "bg-yellow-900/40 text-yellow-400",
    info: "bg-blue-900/40 text-blue-400",
  }[variant];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

const STATUS_OPTIONS = ["", "approved", "pending", "rejected", "flagged"];

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const res = await adminFetch(`/api/admin/profiles?${params}`);
      const data = await res.json();
      setProfiles(data.profiles ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load profiles");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleActive = async (profile: AdminProfile) => {
    setActing(profile.id);
    try {
      const res = await adminFetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, updates: { is_active: !profile.is_active } }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(profile.is_active ? "Profile hidden" : "Profile shown");
      await fetchData();
    } catch {
      toast.error("Action failed");
    } finally {
      setActing(null);
    }
  };

  const fmt = (val?: string) =>
    val ? new Date(val).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—";

  const approvalBadge = (s?: string): "default" | "success" | "danger" | "warning" | "info" => {
    if (s === "approved") return "success";
    if (s === "rejected") return "danger";
    if (s === "pending") return "warning";
    return "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Profiles</h1>
          <p className="text-sm text-text-gray-opacity mt-1">{total} profiles</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-xl border border-dark-border px-3 py-2 text-sm text-text-gray-opacity hover:text-primary-text hover:bg-dark-surface transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search name, username, city, email, ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-dark-border bg-input-bg px-4 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary w-64"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-xl border border-dark-border bg-input-bg px-4 py-2 text-sm text-primary-text outline-none focus:border-primary"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || "All statuses"}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-surface border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Profile</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Verified</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Active</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Joined</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-dark-surface animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-gray-opacity">No profiles found</td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.id} className="hover:bg-dark-surface/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-text">{p.working_name ?? "—"}</p>
                    <p className="text-xs text-text-gray-opacity">@{p.username ?? "—"} · {p.city}, {p.country}</p>
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">{p.profile_type ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={approvalBadge(p.approval_status)}>{p.approval_status ?? "none"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.is_fully_verified ? "success" : "default"}>
                      {p.is_fully_verified ? "Verified" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.is_active ? "success" : "danger"}>
                      {p.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">{fmt(p.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.username && (
                        <a
                          href={`/profile/${p.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-text-gray-opacity border border-dark-border hover:bg-dark-surface transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={acting === p.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                          p.is_active
                            ? "bg-rose-900/30 text-rose-400 hover:bg-rose-900/50"
                            : "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                        }`}
                      >
                        {p.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {p.is_active ? "Hide" : "Show"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="flex items-center justify-between text-sm text-text-gray-opacity">
          <span>Page {page} · {total} profiles</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={profiles.length < 50}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
