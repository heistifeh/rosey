"use client";

import { UploadPicturesForm } from "@/components/auth/upload-pictures-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UploadPicturesContent() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  return <UploadPicturesForm mode={isEdit ? "update" : "create"} />;
}

export default function UploadPicturesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadPicturesContent />
    </Suspense>
  );
}
