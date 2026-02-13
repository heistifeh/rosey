import { groq } from "next-sanity";

export const postFields = groq`
  _id,
  _createdAt,
  _updatedAt,
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
  *[_type == "post" && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())] | order(coalesce(publishedAt, _createdAt) desc) {
    ${postFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`;

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())] | order(coalesce(publishedAt, _createdAt) desc) {
    ${postFields}
  }
`;

export const hotPostsQuery = groq`
  *[_type == "post" && hot == true && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())] | order(coalesce(publishedAt, _createdAt) desc) {
    ${postFields}
  }
`;

export const recentPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    ${postFields}
  }
`;
