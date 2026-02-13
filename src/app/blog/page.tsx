import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";

export const metadata: Metadata = {
  title: "Rosey Blog",
  description:
    "Insights, stories, and practical guidance for modern companionship.",
};

type BlogArticle = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  readTime: string;
};

const hotArticles: BlogArticle[] = [
  {
    id: 1,
    title: "Interview with Miami Escort Jade Alisson",
    slug: "interview-miami-escort-jade-alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
  {
    id: 2,
    title: "Understanding Modern Companionship",
    slug: "understanding-modern-companionship",
    description:
      "A deep dive into the changing landscape of professional companionship and its societal impact.",
    image: "/images/blog2.png",
    readTime: "15 min read",
  },
  {
    id: 3,
    title: "The Art of Boundary Setting",
    slug: "art-of-boundary-setting",
    description:
      "Practical advice on establishing and maintaining healthy boundaries for both providers and clients.",
    image: "/images/blog3.png",
    readTime: "10 min read",
  },
];

const featuredArticles: BlogArticle[] = [
  {
    id: 4,
    title: "How to Choose a Reputable Provider",
    slug: "how-to-choose-reputable-provider",
    description:
      "A step-by-step guide to verifying credentials and ensuring a safe, high-quality experience.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
  {
    id: 5,
    title: "The Importance of Clear Communication",
    slug: "importance-of-clear-communication",
    description:
      "Why effective communication is the foundation of every successful companion engagement.",
    image: "/images/blog2.png",
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "Navigating Legal Realities",
    slug: "navigating-legal-realities",
    description:
      "An overview of the legal considerations involved in professional companion services.",
    image: "/images/blog3.png",
    readTime: "20 min read",
  },
  {
    id: 7,
    title: "Building Lasting Professional Connections",
    slug: "building-lasting-professional-connections",
    description:
      "Tips on fostering respectful and enduring relationships in the companionship industry.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
];

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <article className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden h-full">
      <div className="relative w-full aspect-[4/3]">
        <Image src={article.image} alt={article.title} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-3 p-5 md:gap-4 md:p-6 h-full">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg md:text-xl font-semibold text-primary-text line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm md:text-base font-normal text-text-gray-opacity line-clamp-3">
            {article.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <Link
            href={`/blog/${article.slug}`}
            className="text-primary text-sm md:text-base font-medium underline"
          >
            Read Article
          </Link>
          <span className="text-sm md:text-base text-text-gray-opacity inline-flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {article.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const heroArticle = hotArticles[0];
  const sideHotArticles = hotArticles.slice(1);

  return (
    <section className="flex min-h-screen flex-col bg-input-bg overflow-x-hidden">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 md:px-[60px] md:pb-24 md:pt-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <p className="text-base font-semibold text-text-gray-opacity md:text-[24px]">Blog</p>
          <h1 className="text-3xl font-semibold leading-tight text-primary-text sm:text-4xl md:text-6xl lg:text-[72px]">
            Insights, Stories and Guidance for Modern Companionship
          </h1>
        </div>

        <section className="py-12 md:py-20">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-primary-text md:mb-8 md:text-3xl">
            Hot
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <ArticleCard article={heroArticle} />
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {sideHotArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-primary-text md:mb-8 md:text-3xl">
            Featured
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </main>

      <FooterSection />
    </section>
  );
}
