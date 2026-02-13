import { groq } from "next-sanity";

export const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  mainImage,
  authorName,
  publishedAt,
  readTime,
  featured,
  hot,
  seoTitle,
  seoDescription,
  seoImage
`;

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`;

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const hotPostsQuery = groq`
  *[_type == "post" && hot == true] | order(publishedAt desc) {
    ${postFields}
  }
`;
