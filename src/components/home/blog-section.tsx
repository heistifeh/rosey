"use client";

import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type BlogPreviewPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  readTime: string;
};

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

  const cards = posts.slice(0, 3);

  return (
    <section className="flex flex-col gap-6 md:gap-10 bg-primary-bg items-center pt-10 md:pt-20 px-4 md:pb-[47px] pb-10 md:px-[60px]">
      <div className="flex flex-col gap-3 md:gap-6 items-center text-center">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary-text">
          Our Blog
        </p>
        <p className="text-xs md:text-sm font-normal text-text-gray">
          Simple essentials to make the booking process smoother
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <article
                key={`blog-skeleton-${index}`}
                className="flex flex-col bg-input-bg rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-[220px] w-full bg-primary-bg/40" />
                <div className="flex flex-col gap-4 p-4 md:p-6">
                  <div className="h-5 w-4/5 bg-primary-bg/40 rounded" />
                  <div className="h-4 w-full bg-primary-bg/40 rounded" />
                  <div className="h-4 w-3/4 bg-primary-bg/40 rounded" />
                </div>
              </article>
            ))
          : cards.map((post) => (
              <article
                key={post._id}
                className="flex flex-col bg-input-bg rounded-3xl overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <Image
                    src={post.image}
                    alt={post.title}
                    height={311}
                    width={424}
                    className="object-cover rounded-3xl"
                  />
                </Link>
                <div className="flex flex-col gap-[42px] p-4 md:p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg md:text-xl font-semibold text-primary-text line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm md:text-base font-normal text-text-gray-opacity line-clamp-3">
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
          <ArrowRight className="h-4 w-4 md:h-6 md:w-6 cursor-pointer" />
        </Button>
      </Link>
    </section>
  );
}
