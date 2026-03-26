import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IDENTITY_BUCKET = "identity-verifications";
const SIGNED_URL_EXPIRY = 60 * 30; // 30 minutes

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }

  // 1. Get profile user_id and basic info
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,user_id,working_name,username,city,country,email,displayed_age,ethnicity_category,gender")
    .eq("id", profileId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // 2. Get identity verification record
  let idDocUrl: string | null = null;
  let selfieUrl: string | null = null;
  let idStatus: string | null = null;

  if (profile.user_id) {
    const { data: idVerification } = await supabase
      .from("identity_verifications")
      .select("id_document_path,selfie_with_id_path,status")
      .eq("user_id", profile.user_id)
      .maybeSingle();

    if (idVerification?.id_document_path) {
      const { data: signed } = await supabase.storage
        .from(IDENTITY_BUCKET)
        .createSignedUrl(idVerification.id_document_path, SIGNED_URL_EXPIRY);
      idDocUrl = signed?.signedUrl ?? null;
    }

    if (idVerification?.selfie_with_id_path) {
      const { data: signed } = await supabase.storage
        .from(IDENTITY_BUCKET)
        .createSignedUrl(idVerification.selfie_with_id_path, SIGNED_URL_EXPIRY);
      selfieUrl = signed?.signedUrl ?? null;
    }

    idStatus = idVerification?.status ?? null;
  }

  // 3. Get profile photos
  const { data: images } = await supabase
    .from("images")
    .select("id,public_url,is_primary,created_at")
    .eq("profile_id", profileId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(9);

  return NextResponse.json({
    profile: {
      id: profile.id,
      working_name: profile.working_name,
      username: profile.username,
      city: profile.city,
      country: profile.country,
      email: profile.email,
      displayed_age: profile.displayed_age,
      ethnicity_category: profile.ethnicity_category,
      gender: profile.gender,
    },
    idDoc: idDocUrl,
    selfie: selfieUrl,
    idStatus,
    profileImages: (images ?? []).map((img) => ({
      id: img.id,
      url: img.public_url,
      isPrimary: img.is_primary,
    })),
  });
}
