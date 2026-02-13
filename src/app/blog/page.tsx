import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { client } from "@/sanity/lib/client";
import { featuredPostsQuery, hotPostsQuery, postsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { buildExcerpt } from "@/sanity/lib/serializers";
import { urlFor } from "@/sanity/lib/image";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rosey.link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Rosey",
  description:
    "Insights, stories, and practical guidance for modern companionship, safety, booking, and provider growth.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Rosey Blog",
    description:
      "Insights, stories, and practical guidance for modern companionship, safety, booking, and provider growth.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosey Blog",
    description:
      "Insights, stories, and practical guidance for modern companionship, safety, booking, and provider growth.",
  },
};

const imageUrl = (image?: Post["mainImage"]) =>
  image ? urlFor(image).width(1200).height(700).url() : "/images/blog1.png";

const publishedLabel = (post: Post) => {
  const dateRaw = post.publishedAt || post._createdAt;
  if (!dateRaw) return "";
  return new Date(dateRaw).toLocaleDateString();
};

function BlogCard({ post }: { post: Post }) {
  const excerpt = post.excerpt || buildExcerpt(post.body);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-primary-bg">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] w-full">
        <Image src={imageUrl(post.mainImage)} alt={post.title} fill className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <h3 className="line-clamp-2 text-xl font-semibold text-primary-text">{post.title}</h3>
        <p className="line-clamp-3 text-sm text-text-gray-opacity">{excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary underline">
            Read Article
          </Link>
          <div className="flex items-center gap-2 text-xs text-text-gray-opacity">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readTime || "5 min read"}</span>
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

        {heroPost ? (
          <section className="mt-12 md:mt-16">
            <h2 className="mb-4 text-xl font-semibold text-primary-text md:mb-8 md:text-3xl">Hot</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              <article className="md:col-span-2 flex h-full flex-col overflow-hidden rounded-3xl bg-primary-bg">
                <Link href={`/blog/${heroPost.slug}`} className="relative block aspect-[16/10] w-full">
                  <Image src={imageUrl(heroPost.mainImage)} alt={heroPost.title} fill className="object-cover" priority />
                </Link>
                <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                  <h3 className="text-xl font-semibold text-primary-text md:text-2xl">{heroPost.title}</h3>
                  <p className="line-clamp-3 text-sm text-text-gray-opacity md:text-base">
                    {heroPost.excerpt || buildExcerpt(heroPost.body)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Link href={`/blog/${heroPost.slug}`} className="text-sm font-medium text-primary underline md:text-base">
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
            </div>
          </section>
        ) : null}

        {featuredPosts.length > 0 ? (
          <section className="mt-14 md:mt-20">
            <h2 className="mb-4 text-xl font-semibold text-primary-text md:mb-8 md:text-3xl">Featured Articles</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 md:mt-20">
          <h2 className="mb-4 text-xl font-semibold text-primary-text md:mb-8 md:text-3xl">Latest Posts</h2>
          {latestPosts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-primary-bg p-8 text-center text-text-gray-opacity">
              No articles published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {latestPosts.map((post) => (
                <article key={post._id} className="flex h-full flex-col overflow-hidden rounded-3xl bg-primary-bg">
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] w-full">
                    <Image src={imageUrl(post.mainImage)} alt={post.title} fill className="object-cover" />
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
