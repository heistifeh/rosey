"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk femdom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
  {
    id: 2,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk femdom, boundaries, and feeling powerful.",
    image: "/images/blog2.png",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk femdom, boundaries, and feeling powerful.",
    image: "/images/blog3.png",
    readTime: "12 min read",
  },
];

export function BlogSection() {
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
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col bg-input-bg rounded-3xl overflow-hidden"
          >
            <div className="">
              <Image
                src={post.image}
                alt={post.title}
                height={311}
                width={424}
                // fill
                className="object-cover rounded-3xl"
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
              />
            </div>
            <div className="flex flex-col gap-[42px] p-4 md:p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg md:text-xl font-semibold text-primary-text">
                  {post.title}
                </h3>
                <p className="text-sm md:text-base font-normal text-text-gray-opacity">
                  {post.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  href="#"
                  className="text-primary text-sm md:text-base font-medium underline"
                >
                  Read Article
                </Link>
                <span className="text-sm md:text-base text-text-gray-opacity">
                  {post.readTime}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

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
