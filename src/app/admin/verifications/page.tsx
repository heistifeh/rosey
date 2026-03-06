"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface VerificationProfile {
  id: string;
  working_name?: string;
  username?: string;
  city?: string;
  country?: string;
  approval_status?: string;
  id_verified: boolean;
  verification_photo_verified: boolean;
  min_photos_verified: boolean;
  profile_fields_verified: boolean;
  is_fully_verified: boolean;
  verified_at?: string;
  verification_notes?: string;
  created_at: string;
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-green-400">✓</span>
  ) : (
    <span className="text-rose-400">✗</span>
  );
}

export default function AdminVerificationsPage() {
  const [profiles, setProfiles] = useState<VerificationProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ profileId: string; name: string } | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ filter });
      if (search) params.set("search", search);
      const res = await adminFetch(`/api/admin/verifications?${params}`);
      const data = await res.json();
      setProfiles(data.verifications ?? []);
    } catch {
      toast.error("Failed to load verifications");
    } finally {
      setIsLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleVerdict = async (profileId: string, action: "approve" | "reject", notes?: string) => {
    setActing(profileId);
    try {
      const res = await adminFetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action, notes }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(action === "approve" ? "Profile approved" : "Profile rejected");
      setRejectModal(null);
      setRejectNotes("");
      await fetchData();
    } catch {
      toast.error("Action failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Verifications</h1>
          <p className="text-sm text-text-gray-opacity mt-1">{profiles.length} profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-dark-border overflow-hidden text-sm">
            {(["pending", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 capitalize transition-colors ${filter === f ? "bg-tag-bg text-primary" : "text-text-gray-opacity hover:bg-dark-surface"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-dark-border px-3 py-2 text-sm text-text-gray-opacity hover:text-primary-text hover:bg-dark-surface transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, username, city, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-xl border border-dark-border bg-input-bg px-4 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary w-72"
      />

      <div className="rounded-2xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-surface border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Profile</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-gray-opacity">ID</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-gray-opacity">Photo</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-gray-opacity">Pictures</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-gray-opacity">Fields</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-gray-opacity">Verified</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Notes</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-gray-opacity">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-dark-surface animate-pulse w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-gray-opacity">
                  No pending verifications
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.id} className="hover:bg-dark-surface/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-text">{p.working_name ?? "—"}</p>
                    <p className="text-xs text-text-gray-opacity">@{p.username ?? "—"} · {p.city}, {p.country}</p>
                  </td>
                  <td className="px-4 py-3 text-center"><Check ok={p.id_verified} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={p.verification_photo_verified} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={p.min_photos_verified} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={p.profile_fields_verified} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={p.is_fully_verified} /></td>
                  <td className="px-4 py-3 text-xs text-text-gray-opacity max-w-[160px] truncate">
                    {p.verification_notes ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!p.is_fully_verified && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerdict(p.id, "approve")}
                          disabled={acting === p.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ profileId: p.id, name: p.working_name ?? p.id })}
                          disabled={acting === p.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-primary-bg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-primary-text">Reject Verification</h2>
            <p className="text-sm text-text-gray-opacity">
              Rejecting <span className="text-primary-text font-medium">{rejectModal.name}</span>. Provide a reason:
            </p>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. ID photo is blurry, face not visible..."
              rows={3}
              className="w-full rounded-xl border border-dark-border bg-input-bg px-4 py-2.5 text-sm text-primary-text placeholder:text-text-gray-opacity outline-none focus:border-primary resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal(null); setRejectNotes(""); }}
                className="rounded-xl border border-dark-border px-4 py-2 text-sm text-text-gray-opacity hover:bg-dark-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerdict(rejectModal.profileId, "reject", rejectNotes)}
                disabled={acting === rejectModal.profileId}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {acting === rejectModal.profileId ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
