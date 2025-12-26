"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";
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
      text: "I just have to say how much more I appreciate Discover Escort compared to other platforms. Everything feels so much more organized and intuitive, which makes navigating the site an absolute breeze.",
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

const similarProfiles = [
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

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeNav, setActiveNav] = useState("Home");
  const [activeTab, setActiveTab] = useState("Overview");

  const resolvedParams = use(params);
  const profileId = parseInt(resolvedParams.id);
  const baseProfile =
    allProfiles.find((p) => p.id === profileId) || allProfiles[0];
  const profile = getDefaultProfileData(baseProfile);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  const tabs = ["Overview", "Availability", "Photos", "Contact", "Reviews"];

  return (
    <section className="flex flex-col min-h-screen bg-primary-bg">
      <header className="flex px-4 md:px-[60px] pt-4 md:pt-[60px] pb-6">
        <section className="flex justify-between bg-primary-text rounded-[200px] px-4 py-5 w-full ">
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
                className={`text-base font-medium transition-colors ${
                  activeNav === link.label
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
              <ProfileReviewsSection reviews={profile.reviews} />
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
            <ProfileReviewsSection reviews={profile.reviews} />
          )}

          <SimilarProfilesSection profiles={similarProfiles} />
        </div>
      </main>

      <FooterSection />
    </section>
  );
}
