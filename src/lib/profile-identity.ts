export type HomepageProfile = {
  id: string;
  user_id: string | null;
  working_name: string | null;
  username: string | null;
  city: string | null;
  country: string | null;
  tagline: string | null;
  is_fully_verified: boolean | null;
  contact_email: string | null;
  contact_phone: string | null;
  source_url: string | null;
  created_at: string;
  images: { public_url: string; is_primary: boolean }[] | null;
};

type ProfileIdentityShape = {
  id?: string | null;
  user_id?: string | null;
  username?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  source_url?: string | null;
};

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() || "";

const normalizePhone = (value?: string | null) => {
  const digits = value?.replace(/\D/g, "") || "";
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
};

const normalizeSourceUrl = (value?: string | null) => {
  const raw = value?.trim();
  if (!raw) return "";
  return raw
    .split("#")[0]
    .split("?")[0]
    .replace(/\/+$/, "")
    .toLowerCase();
};

// Returns ALL applicable identity keys for a profile.
// Two profiles sharing ANY key are considered duplicates.
export const getProfileIdentityKeys = (profile: ProfileIdentityShape): string[] => {
  const keys: string[] = [];

  if (profile.user_id) keys.push(`user:${profile.user_id}`);

  const email = normalizeEmail(profile.contact_email);
  if (email) keys.push(`email:${email}`);

  const phone = normalizePhone(profile.contact_phone);
  if (phone) keys.push(`phone:${phone}`);

  const sourceUrl = normalizeSourceUrl(profile.source_url);
  if (sourceUrl) keys.push(`source:${sourceUrl}`);

  if (profile.username) keys.push(`username:${profile.username.trim().toLowerCase()}`);
  if (profile.id) keys.push(`profile:${profile.id}`);

  return keys.length > 0 ? keys : ["profile:unknown"];
};

// Returns a single primary key (backward compat).
export const getProfileIdentityKey = (profile: ProfileIdentityShape) => {
  return getProfileIdentityKeys(profile)[0];
};

export const dedupeProfilesByIdentity = <T extends ProfileIdentityShape>(
  profiles: T[],
) => {
  const seen = new Set<string>();
  const deduped: T[] = [];

  (profiles ?? []).forEach((profile) => {
    const keys = getProfileIdentityKeys(profile);
    if (keys.some((k) => seen.has(k))) return;
    keys.forEach((k) => seen.add(k));
    deduped.push(profile);
  });

  return deduped;
};

// Interleaves sponsored profiles into organic at regular intervals.
// e.g. with interval=4: [o, o, o, o, S, o, o, o, o, S, ...]
export const interleaveSponsored = <T extends ProfileIdentityShape>(
  organic: T[],
  sponsored: T[],
  interval = 4,
): T[] => {
  if (sponsored.length === 0) return organic;

  const result: T[] = [];
  let sIdx = 0;

  for (let i = 0; i < organic.length; i++) {
    result.push(organic[i]);
    if ((i + 1) % interval === 0 && sIdx < sponsored.length) {
      result.push(sponsored[sIdx++]);
    }
  }

  // Append any remaining sponsored profiles at the end
  while (sIdx < sponsored.length) {
    result.push(sponsored[sIdx++]);
  }

  return result;
};
