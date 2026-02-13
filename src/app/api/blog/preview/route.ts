import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { recentPostsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { buildExcerpt } from "@/sanity/lib/serializers";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

const imageUrl = (image?: Post["mainImage"]) =>
  image ? urlFor(image).width(800).height(500).url() : "/images/blog1.png";

export async function GET() {
  try {
    const posts = await client.fetch<Post[]>(recentPostsQuery, { limit: 3 });

    const normalized = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || buildExcerpt(post.body),
      image: imageUrl(post.mainImage),
      readTime: post.readTime || "5 min read",
    }));

    return NextResponse.json({ posts: normalized });
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
