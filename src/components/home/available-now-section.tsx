import Link from "next/link";
import { ArrowRight, Circle } from "lucide-react";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { SafeImage } from "@/components/ui/safe-image";
import { TaglineReveal } from "@/components/home/tagline-reveal";
import { createServiceRoleClient, SERVICE_ROLE_KEY } from "@/server/supabase-client";
import { getServerTranslator } from "@/lib/i18n/server";

export const revalidate = 30;

type NormalizedAvailableNowItem = {
  type: "profile" | "ad";
  profileId: string;
  username: string | null;
  workingName: string;
  city?: string | null;
  country?: string | null;
  tagline?: string | null;
  imageUrl: string;
};

export async function AvailableNowSection() {
  const { t } = await getServerTranslator();

  if (!SERVICE_ROLE_KEY) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data: profiles = [] } = await supabase
    .from("profiles")
    .select("id,working_name,username,city,country,tagline,created_at,images(public_url,is_primary)")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: ads = [] } = await supabase
    .from("ads")
    .select(
      "id,created_at,profile:profiles(id,working_name,username,city,country,tagline,images(public_url,is_primary))"
    )
    .eq("status", "active")
    .eq("placement_available_now", true)
    .order("created_at", { ascending: false })
    .limit(1);

  const normalizedProfiles: NormalizedAvailableNowItem[] = (profiles ?? []).map(
    (profile) => {
      const images = profile.images ?? [];
      const primary = images.find((img) => img.is_primary) ?? images[0];
      const imageUrl = primary?.public_url || "/placeholder.png";
      return {
        type: "profile",
        profileId: profile.id,
        username: profile.username ?? null,
        workingName: profile.working_name ?? t("common.provider"),
        city: profile.city ?? null,
        country: profile.country ?? null,
        tagline: profile.tagline ?? null,
        imageUrl,
      };
    }
  );

  const adProfileRaw = ads?.[0]?.profile ?? null;
  const adProfile = Array.isArray(adProfileRaw) ? adProfileRaw[0] : adProfileRaw;
  const adItem: NormalizedAvailableNowItem | null = adProfile
    ? {
        type: "ad",
        profileId: adProfile.id,
        username: adProfile.username ?? null,
        workingName: adProfile.working_name ?? t("common.provider"),
        city: adProfile.city ?? null,
        country: adProfile.country ?? null,
        tagline: adProfile.tagline ?? null,
        imageUrl:
          adProfile.images?.find((img) => img.is_primary)?.public_url ||
          adProfile.images?.[0]?.public_url ||
          "/placeholder.png",
      }
    : null;

  const AD_INDEX = 4;
  const finalItems = [...normalizedProfiles];
  if (adItem) {
    finalItems.splice(AD_INDEX, 0, adItem);
  }

  return (
    <section className="relative z-10 w-full bg-input-bg  pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full px-0 md:px-[60px] flex-col gap-4 md:gap-10">
        <div className=" flex justify-between items-center px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-text lg:text-[36px]">
            {t("availableNow.title")}
          </h2>

          {normalizedProfiles.length >= 12 ? (
            <Link
              href="/search?availableNow=true"
              className="ml-auto inline-flex items-center gap-1 md:gap-2 rounded-full bg-primary px-3 py-1.5 md:px-[42px] md:py-[13px] text-xs font-semibold text-primary-text cursor-pointer hover:bg-primary/90 transition-colors"
            >
              {t("availableNow.seeAll")}
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          ) : (
            <button
              disabled
              className="ml-auto inline-flex items-center gap-1 md:gap-2 rounded-full bg-primary/50 px-3 py-1.5 md:px-[42px] md:py-[13px] text-xs font-semibold text-primary-text/50 cursor-not-allowed"
            >
              {t("availableNow.seeAll")}
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0 scrollbar-hide px-[15px]">
          {finalItems.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <BaseCardSkeleton key={i} />
            ))
          ) : (
            finalItems.map((item, index) => (
              <Link
                key={`${item.type}-${item.profileId}`}
                href={`/profile/${item.username || item.profileId}`}
                className={`group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#26262a] bg-primary-bg p-2 shadow-sm min-w-[220px] sm:min-w-0 cursor-pointer hover:opacity-90 transition-opacity md:p-3`}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-[14px] md:aspect-[4/5] md:rounded-[16px]">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.workingName}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={index < 4}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-1.5 pt-2 md:gap-3 md:pt-3">
                  <div className="flex  justify-between gap-2 items-center">
                    <p className="text-sm font-normal text-primary-text md:text-lg">
                      {item.workingName}
                    </p>
                  </div>
                  <p className="text-xs text-text-gray-opacity md:text-sm">
                    {[item.city, item.country].filter(Boolean).join(", ") || t("common.locationNotSet")}
                  </p>
                  <TaglineReveal tagline={item.tagline} />

                  <div className="flex items-center gap-1.5 md:gap-2 bg-input-bg rounded-[200px] px-2 py-1 md:px-3 md:py-2">
                    <Circle className="h-1.5 w-1.5 md:h-2 md:w-2 fill-current text-emerald-400" />
                    <span className="text-xs md:text-sm lg:text-[16px] font-normal text-primary-text">
                      {t("availableNow.badge")}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
          {finalItems.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              {t("availableNow.empty")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
