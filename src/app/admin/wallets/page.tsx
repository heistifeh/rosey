"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { RefreshCw, Plus, Minus } from "lucide-react";

interface AdminWallet {
  id: string;
  user_id: string;
  balance_credits: number;
  created_at: string;
  user_email?: string | null;
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [adjustModal, setAdjustModal] = useState<AdminWallet | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [acting, setActing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      const res = await adminFetch(`/api/admin/wallets?${params}`);
      const data = await res.json();
      setWallets(data.wallets ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load wallets");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdjust = async (dir: "credit" | "debit") => {
    if (!adjustModal) return;
    const raw = parseFloat(adjustAmount);
    if (isNaN(raw) || raw <= 0) {
      toast.error("Enter a valid positive amount");
      return;
    }
    const amount = dir === "debit" ? -raw : raw;
    setActing(true);
    try {
      const res = await adminFetch("/api/admin/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId: adjustModal.id, amount, note: adjustNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success(`Balance updated → ${data.new_balance} credits`);
      setAdjustModal(null);
      setAdjustAmount("");
      setAdjustNote("");
      await fetchData();
    } catch (e: any) {
      toast.error(e.message ?? "Action failed");
    } finally {
      setActing(false);
    }
  };

  const fmt = (val?: string) =>
    val ? new Date(val).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Wallets</h1>
          <p className="text-sm text-text-gray-opacity mt-1">{total} wallets</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-xl border border-dark-border px-3 py-2 text-sm text-text-gray-opacity hover:text-primary-text hover:bg-dark-surface transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by user ID..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="rounded-xl border border-dark-border bg-input-bg px-4 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary w-72"
      />

      <div className="rounded-2xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-surface border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">User</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-dark-surface animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : wallets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-gray-opacity">No wallets found</td>
              </tr>
            ) : (
              wallets.map((w) => (
                <tr key={w.id} className="hover:bg-dark-surface/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-primary-text font-medium">{w.user_email ?? "Unknown"}</p>
                    <p className="text-xs text-text-gray-opacity font-mono">{w.user_id}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${w.balance_credits > 0 ? "text-primary-text" : "text-text-gray-opacity"}`}>
                      {w.balance_credits ?? 0}
                    </span>
                    <span className="text-xs text-text-gray-opacity ml-1">credits</span>
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">{fmt(w.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setAdjustModal(w)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border border-dark-border text-text-gray-opacity hover:bg-dark-surface hover:text-primary-text transition-colors"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="flex items-center justify-between text-sm text-text-gray-opacity">
          <span>Page {page} · {total} wallets</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={wallets.length < 50}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Adjust modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-primary-bg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-primary-text">Adjust Balance</h2>
            <p className="text-sm text-text-gray-opacity">
              {adjustModal.user_email ?? adjustModal.user_id}
              <span className="ml-2 text-primary-text font-medium">
                Current: {adjustModal.balance_credits} credits
              </span>
            </p>
            <div className="space-y-3">
              <input
                type="number"
                min="1"
                placeholder="Amount (credits)"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-input-bg px-4 py-2.5 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Note / reason (optional)"
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-input-bg px-4 py-2.5 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setAdjustModal(null); setAdjustAmount(""); setAdjustNote(""); }}
                className="flex-1 rounded-xl border border-dark-border px-4 py-2 text-sm text-text-gray-opacity hover:bg-dark-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdjust("debit")}
                disabled={acting}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-900/40 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-900/60 transition-colors disabled:opacity-50"
              >
                <Minus className="h-3.5 w-3.5" /> Deduct
              </button>
              <button
                onClick={() => handleAdjust("credit")}
                disabled={acting}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-green-900/40 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-900/60 transition-colors disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
