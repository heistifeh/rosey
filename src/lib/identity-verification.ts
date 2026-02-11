"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getAuthData } from "@/api/axios-config";

type UploadKind = "id-card" | "selfie";

const bucket = "identity-verifications";

const ensureExt = (file: File, fallback: string) => {
  const name = file.name || "";
  const match = name.match(/\.([a-z0-9]+)$/i);
  if (match?.[1]) return match[1].toLowerCase();
  const type = file.type || "";
  if (type.includes("jpeg")) return "jpeg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  return fallback;
};

export async function getUserId(supabase: SupabaseClient) {
  const cookieAuth = getAuthData();
  if (cookieAuth?.user?.id) {
    return cookieAuth.user.id;
  }

  let authResult = await supabase.auth.getUser();

  if (!authResult.data?.user && !authResult.error) {
    const accessToken = cookieAuth?.access_token;
    const refreshToken = cookieAuth?.refresh_token;

    if (accessToken) {
      authResult = await supabase.auth.getUser(accessToken);
    } else if (accessToken && refreshToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      authResult = await supabase.auth.getUser();
    }
  }

  const authError = authResult.error;
  const user = authResult.data?.user;

  if (authError || !user?.id) {
    throw new Error("AUTH_REQUIRED");
  }

  return user.id;
}

export async function uploadIdentityAsset(params: {
  supabase: SupabaseClient;
  userId: string;
  file: File;
  kind: UploadKind;
}) {
  const { supabase, userId, file, kind } = params;
  const ext = ensureExt(file, "jpg");
  const path = `${userId}/${kind}.${ext}`;

  console.log("UPLOAD DEBUG", {
    bucket,
    path,
    isFile: file instanceof File,
    type: file.type,
    size: file.size,
    name: file.name,
  });

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    throw uploadError;
  }

  const updateData =
    kind === "id-card"
      ? { id_document_path: path }
      : { selfie_with_id_path: path };

  const { error: upsertError } = await supabase
    .from("identity_verifications")
    .upsert(
      {
        user_id: userId,
        status: "draft",
        ...updateData,
      },
      { onConflict: "user_id" }
    );

  if (upsertError) {
    throw new Error("DB_UPSERT_FAILED");
  }

  return { path };
}

export function dataUrlToFile(dataUrl: string, filename: string) {
  const [header, base64] = dataUrl.split(",");
  if (!header || !base64) {
    throw new Error("INVALID_DATA_URL");
  }

  const match = header.match(/data:(.*?);base64/);
  const mime = match?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}
