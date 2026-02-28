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

export const getProfileIdentityKey = (profile: ProfileIdentityShape) => {
  if (profile.user_id) return `user:${profile.user_id}`;

  const email = normalizeEmail(profile.contact_email);
  if (email) return `email:${email}`;

  const phone = normalizePhone(profile.contact_phone);
  if (phone) return `phone:${phone}`;

  const sourceUrl = normalizeSourceUrl(profile.source_url);
  if (sourceUrl) return `source:${sourceUrl}`;

  if (profile.username) return `username:${profile.username.trim().toLowerCase()}`;
  if (profile.id) return `profile:${profile.id}`;

  return "profile:unknown";
};

export const dedupeProfilesByIdentity = <T extends ProfileIdentityShape>(
  profiles: T[],
) => {
  const seen = new Set<string>();
  const deduped: T[] = [];

  (profiles ?? []).forEach((profile) => {
    const identityKey = getProfileIdentityKey(profile);
    if (seen.has(identityKey)) return;
    seen.add(identityKey);
    deduped.push(profile);
  });

  return deduped;
};
