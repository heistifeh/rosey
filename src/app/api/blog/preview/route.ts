import { NextResponse } from "next/server";
import { recentPostsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { buildExcerpt } from "@/sanity/lib/serializers";

export const revalidate = 60;

export async function GET() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SANITY_DATASET ||
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    ) {
      return NextResponse.json({ posts: [] }, { status: 200 });
    }

    const [{ client }, { urlFor }] = await Promise.all([
      import("@/sanity/lib/client"),
      import("@/sanity/lib/image"),
    ]);
    const posts = await client.fetch<Post[]>(recentPostsQuery, { limit: 3 });

    const normalized = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || buildExcerpt(post.body),
      image: post.mainImage
        ? urlFor(post.mainImage).width(800).height(500).url()
        : "/images/blog1.png",
      readTime: post.readTime || "5 min read",
    }));

    return NextResponse.json({ posts: normalized });
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
