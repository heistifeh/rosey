"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";

interface AdminAd {
  id: string;
  title?: string;
  status: string;
  budget_credits: number;
  spent_credits: number;
  placement_available_now: boolean;
  created_at: string;
  profile?: { id: string; working_name?: string; username?: string };
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

const STATUS_OPTIONS = ["", "active", "paused", "expired"];

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set("status", status);
      const res = await adminFetch(`/api/admin/ads?${params}`);
      const data = await res.json();
      setAds(data.ads ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load ads");
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const changeStatus = async (adId: string, newStatus: "active" | "paused" | "expired") => {
    setActing(adId);
    try {
      const res = await adminFetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Ad status updated");
      await fetchData();
    } catch {
      toast.error("Action failed");
    } finally {
      setActing(null);
    }
  };

  const statusBadge = (s: string): "default" | "success" | "danger" | "warning" => {
    if (s === "active") return "success";
    if (s === "expired") return "danger";
    if (s === "paused") return "warning";
    return "default";
  };

  const fmt = (val?: string) =>
    val ? new Date(val).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Ads</h1>
          <p className="text-sm text-text-gray-opacity mt-1">{total} ads</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-xl border border-dark-border bg-input-bg px-4 py-2 text-sm text-primary-text outline-none focus:border-primary"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || "All statuses"}</option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-dark-border px-3 py-2 text-sm text-text-gray-opacity hover:text-primary-text hover:bg-dark-surface transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-surface border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Ad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Profile</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Budget</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Spent</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-gray-opacity">Avail. Now</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-dark-surface animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-gray-opacity">No ads found</td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-dark-surface/40 transition-colors">
                  <td className="px-4 py-3 text-primary-text font-medium max-w-[160px] truncate">
                    {ad.title ?? "Untitled"}
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">
                    {ad.profile?.working_name ?? "—"}
                    {ad.profile?.username && (
                      <span className="text-xs ml-1">(@{ad.profile.username})</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge(ad.status)}>{ad.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-primary-text">{ad.budget_credits ?? 0}</td>
                  <td className="px-4 py-3 text-right text-text-gray-opacity">{ad.spent_credits ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    {ad.placement_available_now ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-text-gray-opacity">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">{fmt(ad.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ad.status !== "active" && (
                        <button
                          onClick={() => changeStatus(ad.id, "active")}
                          disabled={acting === ad.id}
                          className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                      {ad.status === "active" && (
                        <button
                          onClick={() => changeStatus(ad.id, "paused")}
                          disabled={acting === ad.id}
                          className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 transition-colors disabled:opacity-50"
                        >
                          Pause
                        </button>
                      )}
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
          <span>Page {page} · {total} ads</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={ads.length < 50}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
