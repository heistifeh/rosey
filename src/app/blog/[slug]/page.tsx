import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { buildExcerpt } from "@/sanity/lib/serializers";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/sanity/lib/portableText";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

const imageUrl = (image?: Post["mainImage"]) =>
  image ? urlFor(image).width(1600).height(900).url() : "/images/blog1.png";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await client.fetch<Post>(postBySlugQuery, {
    slug: params.slug,
  });

  if (!article) {
    return {
      title: "Article not found | Rosey",
      description: "The requested article could not be found.",
    };
  }

  const title = article.seoTitle || article.title;
  const description =
    article.seoDescription || article.excerpt || buildExcerpt(article.body);
  const ogImage = article.seoImage || article.mainImage;

  return {
    title: `${title} | Rosey`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [urlFor(ogImage).width(1200).height(630).url()] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await client.fetch<Post>(postBySlugQuery, {
    slug: params.slug,
  });

  if (!article) {
    notFound();
  }

  const recommended = (await client.fetch<Post[]>(postsQuery))
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2);

    return (
        <section className="flex flex-col min-h-screen bg-input-bg overflow-x-hidden">
            <Header />

            <main className="flex-grow pt-10 md:pt-20 px-4 md:px-16 pb-20 max-w-6xl mx-auto w-full manrope">

                <Link href="/blog" className="inline-flex items-center gap-2 text-text-gray-opacity hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Articles</span>
                </Link>


                <div className="flex flex-col gap-6 mb-12 animate-fadeInUp">
                    <div className="flex flex-wrap gap-4 text-sm text-text-gray-opacity">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-primary" />
                            <span>{article.authorName || "Rosey"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <span>{article.readTime || ""}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-primary-text leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-xl text-text-gray leading-relaxed max-w-4xl">
                        {article.excerpt || buildExcerpt(article.body)}
                    </p>
                </div>


                <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
                    <Image
                        src={imageUrl(article.mainImage)}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>


                <article className="prose prose-invert prose-primary max-w-none">
                    <div className="text-text-gray text-base leading-relaxed space-y-6">
                        <PortableText
                          value={article.body || []}
                          components={portableTextComponents}
                        />
                    </div>
                </article>


                <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-primary-text">Did you find this helpful?</h3>
                        <p className="text-text-gray-opacity text-sm">Share this article with your connection.</p>
                    </div>
                </div>


                <div className="mt-32">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-primary-text">Recommended for you</h2>
                        <Link href="/blog" className="text-primary hover:underline font-medium">View all articles</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recommended.map((a) => (
                            <Link key={a._id} href={`/blog/${a.slug}`} className="group group-hover:no-underline">
                                <article className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden border border-white/5 h-full transition-transform hover:-translate-y-2 duration-300">
                                    <div className="relative w-full aspect-video">
                                        <Image
                                            src={imageUrl(a.mainImage)}
                                            alt={a.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col gap-4 flex-grow">
                                        <h3 className="text-xl font-semibold text-primary-text group-hover:text-primary transition-colors line-clamp-2">
                                            {a.title}
                                        </h3>
                                        <p className="text-sm text-text-gray-opacity line-clamp-2">
                                            {a.excerpt || buildExcerpt(a.body)}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-4">
                                            <span className="text-primary text-sm font-medium underline">Read Article</span>
                                            <span className="text-xs text-text-gray-opacity">{a.readTime}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <FooterSection />
        </section>
    );
}
