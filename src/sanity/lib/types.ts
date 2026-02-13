import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type Post = {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  mainImage?: SanityImageSource;
  authorName?: string;
  publishedAt?: string;
  readTime?: string;
  featured?: boolean;
  hot?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: SanityImageSource;
};
