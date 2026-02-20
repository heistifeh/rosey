import { redirect } from "next/navigation";

export default function ProfileSetupPage() {
  redirect("/general-information?tab=profile");
}
