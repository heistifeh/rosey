import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";

// const categories = ["Interview", "Adult", "Sex Talk", "Lifestyle"];

const hotArticles = [
  {
    id: 1,
    title: "Interview with Miami Escort Jade Alisson",
    slug: "interview-miami-escort-jade-alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Understanding Modern Companionship",
    slug: "understanding-modern-companionship",
    description:
      "A deep dive into the changing landscape of professional companionship and its societal impact.",
    image: "/images/blog2.png",
    readTime: "15 min read",
    featured: false,
  },
  {
    id: 3,
    title: "The Art of Boundary Setting",
    slug: "art-of-boundary-setting",
    description:
      "Practical advice on establishing and maintaining healthy boundaries for both providers and clients.",
    image: "/images/blog3.png",
    readTime: "10 min read",
    featured: false,
  },
};

const featuredArticles = [
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

export default function BlogPage() {
  return (
    <section className="flex flex-col min-h-screen bg-input-bg overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col items-center px-4 md:px-[60px]">
        <div className="flex flex-col gap-4 md:gap-[24px]">
          <p className="text-text-gray-opacity font-semibold text-base md:text-[24px] text-center animate-fadeInUp">
            Blog
          </p>
          <div className="flex items-center gap-3 md:gap-8 animate-fadeInUp animation-delay-200">
            <Image
              src="/svg/flower.svg"
              alt=""
              width={32}
              height={32}
              className="h-5 w-5 md:h-8 md:w-8"
            />
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[72px] font-semibold text-primary-text text-center leading-tight">
              Insights, Stories & Guidance for Modern Companionship
            </h1>
            <Image
              src="/svg/flower.svg"
              alt=""
              width={32}
              height={32}
              className="h-5 w-5 md:h-8 md:w-8"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const [posts, hotPostsRaw, featuredPostsRaw] = await Promise.all([
    client.fetch<Post[]>(postsQuery),
    client.fetch<Post[]>(hotPostsQuery),
    client.fetch<Post[]>(featuredPostsQuery),
  ]);

  const hotPosts = hotPostsRaw.length > 0 ? hotPostsRaw : posts.slice(0, 3);
  const featuredPosts = featuredPostsRaw.length > 0 ? featuredPostsRaw : posts.slice(3, 9);
  const latestPosts = posts;
  const heroPost = hotPosts[0] || posts[0];
  const sideHotPosts = hotPosts.slice(1, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Rosey Blog",
    url: `${SITE_URL}/blog`,
    blogPost: latestPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt || post._createdAt,
      dateModified: post._updatedAt || post.publishedAt || post._createdAt,
      image: imageUrl(post.mainImage),
      description: post.excerpt || buildExcerpt(post.body),
    })),
  };

  return (
    <section className="flex min-h-screen flex-col bg-input-bg">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 md:px-[60px] md:pb-24 md:pt-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <p className="text-base font-semibold text-text-gray-opacity md:text-[24px]">Blog</p>
          <h1 className="text-3xl font-semibold leading-tight text-primary-text sm:text-4xl md:text-6xl lg:text-[72px]">
            Insights, Stories and Guidance for Modern Companionship
          </h1>
          <p className="text-sm text-text-gray md:text-base">{posts.length} published articles</p>
        </div>

      {/* Hot Section */}
      <div className="px-4 md:px-[60px] py-12 md:py-20">
        <h2 className="text-xl md:text-3xl font-semibold text-primary-text mb-4 md:mb-8 flex items-center gap-2">
          Hot 🔥
        </h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Large Featured Article - Left Side */}
          <article className="flex-1 flex flex-col bg-primary-bg rounded-3xl overflow-hidden">
            <div className="relative w-full aspect-[4/3] md:aspect-video">
              <Image
                src={hotArticles[0].image}
                alt={hotArticles[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 p-5 md:gap-4 md:p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg md:text-2xl font-semibold text-primary-text">
                  {hotArticles[0].title}
                </h3>
                <p className="text-sm md:text-base font-normal text-text-gray-opacity">
                  {hotArticles[0].description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/blog/${hotArticles[0].slug}`}
                  className="text-primary text-sm md:text-base font-medium underline"
                >
                  Read Article
                </Link>
                <span className="text-sm md:text-base text-text-gray-opacity">
                  {hotArticles[0].readTime}
                </span>
              </div>
            </div>
          </article>

          {/* Two Smaller Articles - Right Side */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            {hotArticles.slice(1).map((article) => (
              <article
                key={article.id}
                className="flex flex-col md:flex-row bg-primary-bg rounded-3xl overflow-hidden md:h-[calc(50%-12px)]"
              >
                <div className="relative w-full md:w-[40%] shrink-0 aspect-[4/3] md:aspect-auto">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5 md:p-6 grow justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base md:text-lg font-semibold text-primary-text">
                      {article.title}
                    </h3>
                    <p className="text-sm font-normal text-text-gray-opacity line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-primary text-sm font-medium underline"
                    >
                      Read Article
                    </Link>
                    <span className="text-xs text-text-gray-opacity md:text-sm">{heroPost.readTime || "5 min read"}</span>
                  </div>
                </div>
              </article>

              <div className="flex flex-col gap-4 md:gap-6">
                {sideHotPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg md:text-xl font-semibold text-primary-text">
                    {article.title}
                  </h3>
                  <p className="text-sm md:text-base font-normal text-text-gray-opacity">
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
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-xs text-text-gray-opacity">{publishedLabel(post)}</p>
                    <h3 className="line-clamp-2 text-lg font-semibold text-primary-text">{post.title}</h3>
                    <p className="line-clamp-2 text-sm text-text-gray-opacity">{post.excerpt || buildExcerpt(post.body)}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary underline">
                        Read Article
                      </Link>
                      <span className="text-xs text-text-gray-opacity">{post.readTime || "5 min read"}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FooterSection />
    </section>
  );
}
