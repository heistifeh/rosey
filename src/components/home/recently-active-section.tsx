import Link from "next/link";
import { ArrowRight, BadgeCheck, Circle } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { TaglineReveal } from "@/components/home/tagline-reveal";
import { getServerTranslator } from "@/lib/i18n/server";
import { type HomepageProfile } from "@/lib/profile-identity";

const RECENTLY_ACTIVE_SEARCH_HREF = "/search";
const RECENTLY_ACTIVE_RENDER_LIMIT = 12;

export async function RecentlyActiveSection({ profiles = [] }: { profiles: HomepageProfile[] }) {
  const { t } = await getServerTranslator();

  const itemsToRender = profiles.slice(0, RECENTLY_ACTIVE_RENDER_LIMIT).map((profile) => {
    const images = profile.images ?? [];
    const primaryImage = images.find((img) => img.is_primary) ?? images[0];
    return {
      id: profile.id,
      name: profile.working_name ?? t("common.provider"),
      status: t("recentlyActive.status"),
      city: profile.city ?? null,
      country: profile.country ?? null,
      tagline: profile.tagline ?? null,
      image: primaryImage?.public_url || "/placeholder.png",
      username: profile.username,
      isVerified: Boolean(profile.is_fully_verified),
    };
  });

  return (
    <section className="relative z-10 w-full bg-primary-bg px-4 pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full px-0 md:px-[60px] flex-col gap-4 md:gap-10">
        <div className=" flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-text lg:text-[36px]">
            {t("recentlyActive.title")}
          </h2>

          <Link href={RECENTLY_ACTIVE_SEARCH_HREF} className="ml-auto inline-flex items-center gap-1 md:gap-2 rounded-full bg-primary px-3 py-1.5 md:px-[42px] md:py-[13px] text-xs font-semibold text-primary-text cursor-pointer hover:bg-primary/90 transition-colors">
            {t("recentlyActive.seeAll")}
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0 scrollbar-hide px-[15px]">
          {itemsToRender.map((profile, index) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.username || profile.id}`}
                className={`group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#26262a] bg-primary-bg p-2 shadow-sm min-w-[220px] sm:min-w-0 cursor-pointer hover:opacity-90 transition-opacity md:p-3`}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-[14px] md:aspect-[4/5] md:rounded-[16px]">
                  <SafeImage
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={index < 4}
                  />
                  {profile.isVerified && (
                    <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-200 backdrop-blur-sm">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-1.5 pt-2">
                  <div className="flex  justify-between gap-2 items-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-sm font-normal text-primary-text md:text-lg truncate">
                        {profile.name}
                      </p>
                      {profile.isVerified && (
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"
                          aria-label="Verified profile"
                          title="Verified profile"
                        >
                          <BadgeCheck className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-gray-opacity md:text-sm">
                    {[profile.city, profile.country].filter(Boolean).join(", ") || t("common.locationNotSet")}
                  </p>
                  <TaglineReveal tagline={profile.tagline} />

                  <div className="flex items-center gap-1.5 md:gap-2 rounded-[200px]">
                    <Circle className="h-1.5 w-1.5 md:h-2 md:w-2 fill-current text-emerald-400" />
                    <span className="text-xs md:text-sm lg:text-[16px] font-normal text-primary-text">
                      {profile.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
