import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(1200).height(800).url();
      if (!url) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={value?.alt || "Post image"}
          className="rounded-2xl border border-white/10"
        />
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-primary-text mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-primary-text mt-6 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-text-gray">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href as string | undefined;
      const rel = href?.startsWith("http")
        ? "noreferrer noopener"
        : undefined;
      const target = href?.startsWith("http") ? "_blank" : undefined;
      return (
        <a href={href} rel={rel} target={target} className="text-primary underline">
          {children}
        </a>
      );
    },
  },
};
