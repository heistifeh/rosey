"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type BlogPreviewPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  readTime: string;
};

const fallbackPosts: BlogPreviewPost[] = [
  {
    _id: "1",
    title: "Interview with Miami Escort Jade Alisson",
    slug: "interview-miami-escort-jade-alisson",
    excerpt:
      "We're joined by New York Dominatrix Zoey Belladonna to talk femdom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
  {
    _id: "2",
    title: "Modern Companionship: A Guide",
    slug: "modern-companionship-guide",
    excerpt:
      "Exploring the evolution of companion services and what to expect in the modern era.",
    image: "/images/blog2.png",
    readTime: "8 min read",
  },
  {
    _id: "3",
    title: "Safety First: Booking Tips",
    slug: "safety-first-booking-tips",
    excerpt:
      "Essential tips for a safe and respectful experience when booking companion services.",
    image: "/images/blog3.png",
    readTime: "10 min read",
  },
];

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPreviewPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/blog/preview");

        if (!response.ok) {
          throw new Error("BLOG_PREVIEW_FETCH_FAILED");
        }

        const data = (await response.json()) as { posts?: BlogPreviewPost[] };
        if (mounted) {
          setPosts(data.posts ?? []);
        }
      } catch {
        if (mounted) {
          setPosts([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = (posts.length > 0 ? posts : fallbackPosts).slice(0, 3);

  return (
    <section className="flex flex-col gap-6 bg-primary-bg items-center pt-10 pb-10 px-4 md:gap-10 md:pt-20 md:pb-[47px] md:px-[60px]">
      <div className="flex flex-col gap-3 items-center text-center md:gap-6">
        <p className="text-xl font-semibold text-primary-text md:text-2xl lg:text-3xl">
          Our Blog
        </p>
        <p className="text-xs font-normal text-text-gray md:text-sm">
          Simple essentials to make the booking process smoother
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3 md:gap-6">
        {cards.map((post) => (
          <article
            key={post._id}
            className="flex flex-col bg-input-bg rounded-3xl overflow-hidden"
          >
            <div className="relative w-full aspect-[424/311]">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-5 p-4 md:p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-primary-text md:text-xl line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm font-normal text-text-gray-opacity md:text-base line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary text-sm md:text-base font-medium underline"
                >
                  Read Article
                </Link>
                <span className="text-sm md:text-base text-text-gray-opacity inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && cards.length === 0 ? (
        <p className="text-text-gray-opacity text-sm">No articles published yet.</p>
      ) : null}

      <Link href="/blog">
        <Button
          variant="default"
          size="sm"
          className="w-full md:w-auto text-xs md:text-sm px-4 md:px-6 py-2 md:py-3"
        >
          Visit Our Blog Page
          <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
        </Button>
      </Link>
    </section>
  );
}
