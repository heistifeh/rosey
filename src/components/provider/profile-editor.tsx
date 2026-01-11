 "use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/api/axios-config";
import { apiBuilder } from "@/api/builder";

const FALLBACK_PROVIDER_USER_ID =
  process.env.NEXT_PUBLIC_PROVIDER_USER_ID ??
  "467d35f7-8837-4df9-be3a-6a2d63141843";

const extractUserIdFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  const segments = token.split(".");
  if (segments.length !== 3) return null;
  try {
    const payload = JSON.parse(
      atob(segments[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload?.sub ?? payload?.user_id ?? null;
  } catch {
    return null;
  }
};

export function ProviderProfileEditor() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const userId =
    useMemo(() => extractUserIdFromToken(), []) ?? FALLBACK_PROVIDER_USER_ID;
  const { data: baseProfile, isFetching } = useQuery({
    queryKey: ["provider-profile", userId],
    queryFn: () => apiBuilder.profiles.getProfileByUserId(userId),
    enabled: Boolean(userId),
  });

  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (baseProfile) {
      setTagline(baseProfile.tagline ?? "");
      setPrice(baseProfile.base_hourly_rate?.toString() ?? "");
      setCity(baseProfile.city ?? "");
      setCountry(baseProfile.country ?? "");
    }
  }, [baseProfile]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<{ tagline: string; base_hourly_rate: number; city: string; country: string }>) =>
      apiBuilder.profiles.updateProfileByUserId(userId, payload),
    onSuccess: () => {
      toast.success("Profile updated");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["provider-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile-detail"] });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Unable to save profile");
    },
  });

  const isDirty = useMemo(() => {
    if (!baseProfile) return false;
    return (
      tagline !== (baseProfile.tagline ?? "") ||
      price !== (baseProfile.base_hourly_rate?.toString() ?? "") ||
      city !== (baseProfile.city ?? "") ||
      country !== (baseProfile.country ?? "")
    );
  }, [baseProfile, tagline, price, city, country]);

  const handleSave = () => {
    const payload: Record<string, any> = {};
    if (tagline) payload.tagline = tagline;
    if (price) payload.base_hourly_rate = Number(price);
    if (city) payload.city = city;
    if (country) payload.country = country;
    mutation.mutate(payload);
  };

  if (!userId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full text-xs md:text-sm">
          Edit my profile
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit provider profile</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="provider-city">City</Label>
            <Input
              id="provider-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="provider-country">Country</Label>
            <Input
              id="provider-country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="provider-tagline">Tagline</Label>
            <Input
              id="provider-tagline"
              value={tagline}
              onChange={(event) => setTagline(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="provider-price">Base hourly rate</Label>
            <Input
              id="provider-price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || mutation.isLoading || isFetching}
          >
            {mutation.isLoading ? "Saving…" : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
