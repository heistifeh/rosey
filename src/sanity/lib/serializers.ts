import type { PortableTextBlock } from "next-sanity";

export const buildExcerpt = (body?: PortableTextBlock[], maxLength = 160) => {
  if (!body?.length) return "";
  const text = body
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children.map((child: any) => child.text || "").join("");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
};
