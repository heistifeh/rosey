"use client";

import { Menu, Search, Loader2 } from "lucide-react";

import Link from "next/link";
import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@/types/types";
import { apiBuilder } from "@/api/builder";
import { FooterSection } from "@/components/home/footer-section";
import { ProfileHeroSection } from "@/components/home/profile-hero-section";
import { ProfileBioSection } from "@/components/home/profile-bio-section";
import { ProfilePhotosSection } from "@/components/home/profile-photos-section";
import { ProfileDetailsSection } from "@/components/home/profile-details-section";
import { ProfileAvailabilitySection } from "@/components/home/profile-availability-section";
import { ProfileContactSection } from "@/components/home/profile-contact-section";
import { ProfileReviewsSection } from "@/components/home/profile-reviews-section";
import { SimilarProfilesSection } from "@/components/home/similar-profiles-section";
import { ProfilePhotosTabSection } from "@/components/home/profile-photos-tab-section";
import { getTimeSlotDetail } from "@/constants/availability";

const allProfiles = [
  {
    id: 1,
    name: "Melissa Keen",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl1.png",
  },
  {
    id: 2,
    name: "Cory Daniels",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl2.png",
  },
  {
    id: 3,
    name: "Grace White",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl3.png",
  },
  {
    id: 4,
    name: "Antonio Nairobi",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl4.png",
  },
  {
    id: 5,
    name: "Stella Maris",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl5.png",
  },
  {
    id: 6,
    name: "Korra Vicky",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl6.png",
  },
  {
    id: 7,
    name: "Angela Cage",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl7.png",
  },
  {
    id: 8,
    name: "Vanessa Chase",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl8.png",
  },
  {
    id: 9,
    name: "Sarah Blake",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl9.png",
  },
  {
    id: 10,
    name: "Natalie Fox",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Unavailable",
    image: "/images/girl10.png",
  },
  {
    id: 11,
    name: "Cherie Starr",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available",
    image: "/images/girl11.png",
  },
  {
    id: 12,
    name: "Luna Deville",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl12.png",
  },
  {
    id: 13,
    name: "Jessy Hollywood",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Unavailable",
    image: "/images/girl13.png",
  },
  {
    id: 14,
    name: "Ella Taylor",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available",
    image: "/images/girl14.png",
  },
  {
    id: 15,
    name: "Eva Damsel",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Unavailable",
    image: "/images/girl15.png",
  },
  {
    id: 16,
    name: "Mia Mars",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl16.png",
  },
  {
    id: 17,
    name: "Kathrina Dove",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available",
    image: "/images/girl17.png",
  },
  {
    id: 18,
    name: "Daisy Presley",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl18.png",
  },
];

const getDefaultProfileData = (baseProfile: (typeof allProfiles)[0]) => ({
  ...baseProfile,
  location: "Illinois, Chicago, USA",
  gender: "Female",
  lastActive: "3 min ago",
  bio: "I'm a bubbly, down-to-earth companion who's warm, witty, and effortlessly charming. I love meeting new people and creating memorable experiences. Whether you're looking for companionship, conversation, or something more, I'm here to make your time enjoyable. I'm always up for a good laugh and enjoy exploring new places together.",
  photos: [
    baseProfile.image,
    "/images/girl2.png",
    "/images/girl3.png",
    "/images/girl4.png",
  ],
  details: {
    basedIn: "Chicago, United States",
    colorsTo: "Men, Couples",
    pronouns: "She, Her",
    age: 23,
    height: "5'8/163",
    hairColor: "Blonde",
    eyeColor: "Blue",
    languages: "English, Spanish, French",
  },
  availability: {
    Monday: "5pm-Midnight",
    Tuesday: "All Day",
    Wednesday: "12pm - 8pm",
    Thursday: "All Day",
    Friday: "All Day",
    Saturday: "",
    Sunday: "Midnight-4am",
  },
  reviews: [
    {
      text: "I just have to say how much more I appreciate Rosey compared to other platforms. Everything feels so much more organized and intuitive, which makes navigating the site an absolute breeze.",
      date: "October 2025",
    },
    {
      text: "Great experience! Very personable and easy to talk to. Will definitely book again.",
      date: "September 2025",
    },
    {
      text: "Amazing companion. Everything was perfect from start to finish.",
      date: "August 2025",
    },
    {
      text: "Exceeded all expectations. Professional and delightful.",
      date: "July 2025",
    },
    { text: "Best experience I've had. Truly special.", date: "June 2025" },
    {
      text: "Wonderful person, great conversation, perfect evening.",
      date: "May 2025",
    },
  ],
  contact: {
    email: "Mel@****een***@gmail.com",
    phone: "+164*******419",
    instagram: "Mel***_042",
    location: "Illinois, Chicago, USA",
  },
});

const fallbackSimilarProfiles = [
  {
    id: 1,
    name: "Melissa Keen",
    price: "$250",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl1.png",
  },
  {
    id: 2,
    name: "Cory Daniels",
    price: "$250",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl2.png",
  },
  {
    id: 3,
    name: "Grace White",
    price: "$150",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl3.png",
  },
  {
    id: 4,
    name: "Antonio Nairobi",
    price: "$250",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl4.png",
  },
  {
    id: 5,
    name: "Stella Maris",
    price: "$250",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl5.png",
  },
  {
    id: 6,
    name: "Korra Vicky",
    price: "$150",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl6.png",
  },
  {
    id: 7,
    name: "Angela Cage",
    price: "$250",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl7.png",
  },
  {
    id: 8,
    name: "Vanessa Chase",
    price: "$250",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl8.png",
  },
  {
    id: 9,
    name: "Sarah Blake",
    price: "$150",
    location: "Michigan, Jenna",
    status: "Available Now",
    image: "/images/girl9.png",
  },
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type WeekDay = (typeof WEEK_DAYS)[number];

type AvailabilityEntry =
  | string
  | {
    day?: string;
    time?: string;
  };

type SupabaseProfile = {
  id?: string;
  working_name?: string;
  username?: string;
  city?: string;
  state?: string;
  country?: string;
  city_slug?: string | null;
  country_slug?: string | null;
  base_currency?: string;
  base_hourly_rate?: number | string;
  images?: { public_url: string; is_primary?: boolean }[];
  about?: string;
  pronouns?: string[];
  gender?: string;
  age?: number;
  displayed_age?: number | null;
  height?: string;
  height_cm?: number | null;
  hair_color?: string | null;
  eye_color?: string | null;
  languages?: string[];
  caters_to?: string[];

  available_days?: AvailabilityEntry[];
};

const mergeProfileData = (
  fallbackProfile: ReturnType<typeof getDefaultProfileData>,
  supabaseProfile: SupabaseProfile | null,
) => {
  if (!supabaseProfile) return fallbackProfile;

  const images = supabaseProfile.images ?? [];
  const heroImage =
    images.find((img) => img.is_primary)?.public_url ??
    images[0]?.public_url ??
    fallbackProfile.image;
  const photos = images.length
    ? images.map((img) => img.public_url).filter(Boolean)
    : fallbackProfile.photos;
  const locationParts = [supabaseProfile.city, supabaseProfile.country].filter(
    Boolean,
  );
  const normalizedLocation =
    locationParts.length > 0 ? locationParts.join(", ") : "N/A";

  const price =
    supabaseProfile.base_currency && supabaseProfile.base_hourly_rate
      ? `${supabaseProfile.base_currency}${supabaseProfile.base_hourly_rate}`
      : fallbackProfile.price;

  const baseDetails = fallbackProfile.details;
  const pronouns = supabaseProfile.pronouns?.filter(Boolean).join(", ").trim();
  const languages = supabaseProfile.languages
    ?.filter(Boolean)
    .join(", ")
    .trim();
  const catersTo = supabaseProfile.caters_to?.filter(Boolean).join(", ").trim();
  const detailAge =
    supabaseProfile.displayed_age ?? supabaseProfile.age ?? "N/A";

  const height =
    supabaseProfile.height ??
    (supabaseProfile.height_cm ? `${supabaseProfile.height_cm} cm` : "N/A");

  const normalizeDayName = (value?: string): WeekDay | undefined => {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const candidate = trimmed.split(/[\s,:-]+/)[0];
    if (!candidate) return undefined;

    const matched = WEEK_DAYS.find(
      (day) =>
        day.toLowerCase() === candidate.toLowerCase() ||
        day.toLowerCase().startsWith(candidate.toLowerCase()),
    );
    return matched;
  };

  const availability = supabaseProfile
    ? {
      Monday: "Unavailable",
      Tuesday: "Unavailable",
      Wednesday: "Unavailable",
      Thursday: "Unavailable",
      Friday: "Unavailable",
      Saturday: "Unavailable",
      Sunday: "Unavailable",
    }
    : { ...fallbackProfile.availability };
  const availabilityDetails: Record<WeekDay, string[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
  if (Array.isArray(supabaseProfile.available_days)) {
    supabaseProfile.available_days.forEach((entry) => {
      let dayValue: string | undefined;
      let timeValue = "All Day";

      if (typeof entry === "string") {
        const [dayPart, ...rest] = entry.split(":");
        dayValue = dayPart;
        if (rest.length) {
          const joined = rest.join(":").trim();
          if (joined) {
            timeValue = joined;
          }
        }
      } else if (entry && typeof entry === "object") {
        dayValue = entry.day;
        if (entry.time) {
          timeValue = entry.time;
        }
      }

      const normalizedDay = normalizeDayName(dayValue);
      if (normalizedDay) {
        const detail = getTimeSlotDetail(timeValue);
        const existing = availabilityDetails[normalizedDay] ?? [];
        if (!existing.includes(detail)) {
          availabilityDetails[normalizedDay] = [...existing, detail];
        }
      }
    });
  }

  Object.entries(availabilityDetails).forEach(([day, details]) => {
    if (!details.length) return;
    const normalizedDay = day as WeekDay;
    const hasAllDay = details.some(
      (value) => value.toLowerCase() === "all day",
    );
    availability[normalizedDay] = hasAllDay ? "All Day" : details.join(", ");
  });

  const mergedDetails = {
    ...baseDetails,
    basedIn: normalizedLocation,
    colorsTo: catersTo || "N/A",
    catersTo: catersTo || undefined,
    pronouns: pronouns || "N/A",
    age: detailAge as any,
    height: height,
    hairColor: supabaseProfile.hair_color ?? "N/A",
    eyeColor: supabaseProfile.eye_color ?? "N/A",
    languages: languages || "N/A",
  };

  const contact = {
    email: "N/A", // We don't have email in the profile select yet, or maybe we want to keep it private/hidden?
    phone: "N/A",
    instagram: "N/A",
    location: normalizedLocation,
  };

  return {
    ...fallbackProfile,
    id: supabaseProfile.id ?? fallbackProfile.id,
    name: supabaseProfile.working_name ?? fallbackProfile.name,
    image: heroImage,
    photos,
    location: normalizedLocation || fallbackProfile.location,
    price,
    bio: supabaseProfile.about ?? "No bio available.",
    details: mergedDetails,
    availability,
    contact,
  };
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeNav, setActiveNav] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const resolvedParams = use(params);
  const username = resolvedParams.id;

  useQuery({
    queryKey: ["current-user"],
    queryFn: () => apiBuilder.auth.getCurrentUser(),
    enabled: true,
  });


  const { data: userData } = useQuery({
    queryKey: ["current-user-data"],
    queryFn: () => apiBuilder.auth.getCurrentUser(),
  });

  const { data: myProfile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => apiBuilder.profiles.getMyProfile(),
    enabled: !!userData?.id,
  });

  const {
    data: myClient,
    isLoading: isLoadingClient,
    refetch: refetchClient,
  } = useQuery({
    queryKey: ["my-client", userData?.id],
    queryFn: () => apiBuilder.clients.getMyClientProfile(userData?.id),
    enabled: !!userData?.id,
  });

  const { data: supabaseProfile, isLoading } = useQuery({
    queryKey: ["profile-detail", username],
    queryFn: () => apiBuilder.profiles.getProfileByUsername(username),
    enabled: Boolean(username),
  });

  const { data: similarProfiles = [], isLoading: similarProfilesLoading } =
    useQuery<Profile[]>({
      queryKey: [
        "profile-similar",
        supabaseProfile?.city_slug,
        supabaseProfile?.country_slug,
        supabaseProfile?.gender,
      ],
      enabled: Boolean(
        supabaseProfile?.city_slug && supabaseProfile?.country_slug,
      ),
      queryFn: () =>
        apiBuilder.profiles.getProfiles({
          citySlug: supabaseProfile?.city_slug ?? undefined,
          countrySlug: supabaseProfile?.country_slug ?? undefined,
          gender: supabaseProfile?.gender,
          applyDefaults: false,
        }),
    });

  const isOwner =
    userData?.id &&
    supabaseProfile?.user_id &&
    userData.id === supabaseProfile.user_id;

  const fallbackProfile = getDefaultProfileData(allProfiles[0]);
  const profile = mergeProfileData(fallbackProfile, supabaseProfile);

  const [localReviews, setLocalReviews] = useState(profile.reviews);

  // Sync state if profile.reviews changes (e.g. from data fetch)
  if (
    localReviews !== profile.reviews &&
    localReviews.length === 0 &&
    profile.reviews.length > 0
  ) {
    setLocalReviews(profile.reviews);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredSimilarProfiles =
    similarProfiles?.filter((item) => item.id !== profile.id) ?? [];

  const fallbackSimilarProfilesMapped: Profile[] = fallbackSimilarProfiles.map(
    (item) => {
      const parsedRate = Number(item.price.replace(/[^0-9.]/g, ""));
      return {
        id: String(item.id),
        user_id: "fallback",
        working_name: item.name,
        base_hourly_rate: Number.isFinite(parsedRate) ? parsedRate : undefined,
        base_currency: item.price.startsWith("$") ? "$" : undefined,
        city: item.location,
        images: [
          {
            id: `${item.id}-img`,
            profile_id: String(item.id),
            public_url: item.image,
            is_primary: true,
          },
        ],
      };
    },
  );

  const similarProfilesToShow =
    filteredSimilarProfiles.length > 0
      ? filteredSimilarProfiles
      : fallbackSimilarProfilesMapped;

  const handleReviewSubmit = async ({
    rating,
    title,
    comment,
  }: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    if (!supabaseProfile?.id) {
      throw new Error("Unable to identify this profile");
    }

    if (!userData?.id) {
      throw new Error("You must be logged in to review");
    }

    let reviewerId = myClient?.id;

    if (!reviewerId && isLoadingClient) {
      const refreshed = await refetchClient();
      reviewerId = refreshed.data?.id;
    }

    if (!reviewerId) {
      try {
        const created = await apiBuilder.clients.createClientProfile({
          user_id: userData.id,
          email: (userData as any)?.email ?? undefined,
        });
        reviewerId = created?.id;
        if (!reviewerId) {
          throw new Error("Unable to create client profile");
        }
      } catch (error: any) {
        // Handle duplicate client rows by refetching
        const duplicate =
          error?.response?.data?.code === "23505" ||
          error?.code === "23505";
        if (duplicate) {
          const existing = await refetchClient();
          reviewerId = existing.data?.id;
        }

        console.error("Failed to ensure client profile", error);
        if (!reviewerId) {
          throw new Error("You must have a client account to submit a review");
        }
      }
    }

    if (!reviewerId) {
      throw new Error("You must have a client account to submit a review");
    }

    if (userData.id === supabaseProfile.user_id) {
      throw new Error("You cannot review your own profile");
    }

    console.log("review payload", {
      profile_id: supabaseProfile.id,
      client_id: reviewerId,
      rating,
      title,
      body: comment,
    });
    await apiBuilder.reviews.createReview({
      profile_id: supabaseProfile.id,
      client_id: reviewerId,
      rating,
      title,
      body: comment,
    });

    const newReview = {
      text: comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    };

    setLocalReviews((prev) => [newReview, ...prev]);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  const tabs = ["Overview", "Availability", "Photos", "Contact", "Reviews"];

  return (
    <section className="flex flex-col min-h-screen bg-primary-bg overflow-x-hidden">
      <header className="flex px-4 pt-4 pb-6 md:px-[60px] md:pt-[60px]">
        <div className="w-full md:hidden">
          <section className="flex w-full items-center justify-between rounded-[200px] bg-primary-text px-4 py-3">
            <Link href="/" className="inline-flex items-center">
              <span className="text-primary text-3xl font-normal petemoss">
                Rosey
              </span>
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a]"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </section>
          {isMobileMenuOpen && (
            <div className="mt-3 rounded-[24px] bg-primary-text p-4 shadow-lg">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActiveNav(link.label);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`rounded-[200px] px-4 py-2 text-sm font-medium ${activeNav === link.label
                      ? "bg-primary text-primary-text"
                      : "bg-tag-bg text-primary-text"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 rounded-[200px] border border-[#E5E5EA] px-3 py-3">
                  <Search size={16} color={"#8E8E93"} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-center rounded-[200px] bg-primary px-6 py-3">
                  <p className="text-primary-text text-sm font-semibold">
                    Login
                  </p>
                  <p className="text-primary-text text-sm font-semibold">/</p>
                  <p className="text-primary-text text-sm font-semibold">
                    Signup
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <section className="hidden w-full justify-between rounded-[200px] bg-primary-text px-4 py-5 md:flex">
          <Link href="/" className="inline-flex items-center">
            <span className="text-primary text-3xl md:text-[32px] font-normal petemoss">
              Rosey
            </span>
          </Link>

          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`text-base font-medium transition-colors ${activeNav === link.label
                  ? "bg-primary rounded-[200px] py-2 px-[33px] text-primary-text"
                  : "text-[#8E8E93]"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <section className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-[200px] px-3 py-3 border border-[#E5E5EA] w-[290px]">
              <Search size={16} color={"#8E8E93"} />
              <input
                type="text"
                placeholder="Search"
                className="w-32 bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
              />
            </div>
            <div className="flex items-center bg-primary rounded-[200px] px-[31px] py-[13px]">
              <p className="text-primary-text text-base font-semibold">Login</p>
              <p className="text-primary-text text-base font-semibold">/</p>
              <p className="text-primary-text text-base font-semibold">
                Signup
              </p>
            </div>
          </section>
        </section>
      </header>

      <main className="flex-1">
        <div className="px-4 md:px-[60px] pb-8 bg-primary-bg">
          <ProfileHeroSection
            profile={{
              name: profile.name,
              image: profile.image,
              status: profile.status,
              location: profile.location,
              gender: profile.gender,
              lastActive: profile.lastActive,
              price: profile.price,
            }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
            onReviewSubmit={isOwner ? undefined : handleReviewSubmit}
          />

          {activeTab === "Overview" && (
            <div className="space-y-8">
              <ProfileBioSection bio={profile.bio} />
              <ProfilePhotosSection
                photos={profile.photos}
                name={profile.name}
              />
              <ProfileDetailsSection details={profile.details} />
              <ProfileAvailabilitySection availability={profile.availability} />
              <ProfileReviewsSection reviews={localReviews} />
              <ProfileContactSection contact={profile.contact} />
            </div>
          )}

          {activeTab === "Availability" && (
            <ProfileAvailabilitySection availability={profile.availability} />
          )}

          {activeTab === "Photos" && (
            <ProfilePhotosTabSection
              photos={profile.photos}
              name={profile.name}
            />
          )}

          {activeTab === "Contact" && (
            <ProfileContactSection contact={profile.contact} />
          )}

          {activeTab === "Reviews" && (
            <ProfileReviewsSection reviews={localReviews} />
          )}

          <SimilarProfilesSection
            profiles={similarProfilesToShow}
            isLoading={similarProfilesLoading}
          />
        </div>
      </main>

      <FooterSection />
    </section>
  );
}
