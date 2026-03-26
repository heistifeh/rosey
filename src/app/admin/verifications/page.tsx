"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, RefreshCw, Search, X, ExternalLink } from "lucide-react";
import Image from "next/image";

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

interface ReviewData {
  profile: {
    id: string;
    working_name?: string;
    username?: string;
    city?: string;
    country?: string;
    contact_email?: string;
    auth_email?: string;
    displayed_age?: number;
    ethnicity_category?: string;
    gender?: string;
  };
  idDoc: string | null;
  selfie: string | null;
  idStatus: string | null;
  profileImages: { id: string; url: string; isPrimary: boolean }[];
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-green-400">✓</span>
  ) : (
    <span className="text-rose-400">✗</span>
  );
}

function PhotoBox({ src, label }: { src: string | null; label: string }) {
  if (!src) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-full aspect-[3/4] rounded-xl border border-dark-border bg-dark-surface flex items-center justify-center text-text-gray-opacity text-xs">
          No photo
        </div>
        <p className="text-xs text-text-gray-opacity">{label}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full">
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-dark-border hover:border-primary transition-colors">
          <Image src={src} alt={label} fill className="object-cover" unoptimized />
        </div>
      </a>
      <p className="text-xs text-text-gray-opacity">{label}</p>
    </div>
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

  // Review modal
  const [reviewProfile, setReviewProfile] = useState<VerificationProfile | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

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

  const openReview = async (profile: VerificationProfile) => {
    setReviewProfile(profile);
    setReviewData(null);
    setReviewLoading(true);
    try {
      const res = await adminFetch(`/api/admin/verifications/review?profileId=${profile.id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to load review data");
        setReviewProfile(null);
        return;
      }
      setReviewData(data);
    } catch {
      toast.error("Failed to load review data");
      setReviewProfile(null);
    } finally {
      setReviewLoading(false);
    }
  };

  const closeReview = () => {
    setReviewProfile(null);
    setReviewData(null);
  };

  const handleVerdict = async (profileId: string, action: "approve" | "reject" | "revoke", notes?: string) => {
    setActing(profileId);
    try {
      const res = await adminFetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action, notes }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(action === "approve" ? "Profile approved" : action === "revoke" ? "Approval revoked" : "Profile rejected");
      setRejectModal(null);
      setRejectNotes("");
      closeReview();
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openReview(p)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition-colors"
                      >
                        <Search className="h-3.5 w-3.5" /> Review
                      </button>
                      {p.is_fully_verified && (
                        <button
                          onClick={() => handleVerdict(p.id, "revoke")}
                          disabled={acting === p.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Revoke
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

      {/* ── Review Modal ── */}
      {reviewProfile && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
          <div className="w-full max-w-4xl rounded-2xl border border-dark-border bg-primary-bg space-y-6 p-6">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary-text">
                  Review: {reviewProfile.working_name ?? reviewProfile.username ?? reviewProfile.id}
                </h2>
                {reviewData && (
                  <div className="mt-0.5 space-y-0.5">
                    <p className="text-sm text-text-gray-opacity">
                      @{reviewData.profile.username ?? "—"} · {reviewData.profile.city ?? "—"}, {reviewData.profile.country ?? "—"}
                      {reviewData.profile.gender && <> · {reviewData.profile.gender}</>}
                      {reviewData.profile.displayed_age && <>, age {reviewData.profile.displayed_age}</>}
                    </p>
                    {reviewData.profile.auth_email && (
                      <p className="text-xs text-text-gray-opacity">
                        Login: <span className="text-primary-text">{reviewData.profile.auth_email}</span>
                      </p>
                    )}
                    {reviewData.profile.contact_email && (
                      <p className="text-xs text-text-gray-opacity">
                        Contact: <span className="text-primary-text">{reviewData.profile.contact_email}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {reviewData?.profile.username && (
                  <a
                    href={`/profile/${reviewData.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dark-border px-3 py-1.5 text-xs text-text-gray-opacity hover:bg-dark-surface transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Profile
                  </a>
                )}
                <button onClick={closeReview} className="rounded-lg border border-dark-border p-1.5 text-text-gray-opacity hover:bg-dark-surface transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {reviewLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-dark-surface animate-pulse" />
                ))}
              </div>
            ) : reviewData ? (
              <>
                {/* ID documents */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-gray-opacity mb-3">
                    Identity Documents
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <PhotoBox src={reviewData.idDoc} label="Government ID / ID Card" />
                    <PhotoBox src={reviewData.selfie} label="Selfie with ID" />
                  </div>
                  {!reviewData.idDoc && !reviewData.selfie && (
                    <p className="text-xs text-yellow-400 mt-2">
                      ⚠️ No identity documents uploaded yet
                    </p>
                  )}
                </div>

                {/* Profile photos */}
                {reviewData.profileImages.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-gray-opacity mb-3">
                      Profile Photos ({reviewData.profileImages.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {reviewData.profileImages.map((img) => (
                        <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-dark-border hover:border-primary transition-colors">
                            <Image src={img.url} alt="profile photo" fill className="object-cover" unoptimized />
                            {img.isPrimary && (
                              <span className="absolute bottom-1 left-1 rounded bg-primary/80 px-1 py-0.5 text-[9px] font-medium text-white">
                                Primary
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist summary */}
                <div className="rounded-xl border border-dark-border bg-dark-surface/50 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: "ID verified", ok: reviewProfile.id_verified },
                    { label: "Selfie verified", ok: reviewProfile.verification_photo_verified },
                    { label: "Min photos", ok: reviewProfile.min_photos_verified },
                    { label: "Profile fields", ok: reviewProfile.profile_fields_verified },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <Check ok={ok} />
                      <span className="text-text-gray-opacity">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-dark-border">
                  {reviewProfile.verification_notes && (
                    <p className="flex-1 text-xs text-text-gray-opacity italic truncate">
                      Note: {reviewProfile.verification_notes}
                    </p>
                  )}
                  {reviewProfile.is_fully_verified ? (
                    <button
                      onClick={() => handleVerdict(reviewProfile.id, "revoke")}
                      disabled={acting === reviewProfile.id}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" /> Revoke Approval
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          closeReview();
                          setRejectModal({ profileId: reviewProfile.id, name: reviewProfile.working_name ?? reviewProfile.id });
                        }}
                        disabled={acting === reviewProfile.id}
                        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleVerdict(reviewProfile.id, "approve")}
                        disabled={acting === reviewProfile.id}
                        className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-medium bg-green-700 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {acting === reviewProfile.id ? "Approving..." : "Approve Verification"}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

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
