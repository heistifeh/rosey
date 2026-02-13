"use client";

import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, User, Calendar, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const articles = [
    {
        id: 1,
        title: "Interview with Miami Escort Jade Alisson",
        slug: "interview-miami-escort-jade-alisson",
        description: "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
        image: "/images/blog1.png",
        readTime: "12 min read",
        author: "Rosey Team",
        date: "Feb 10, 2026",
        content: `
      <p>In our latest installment of the Digital Companion Series, we sit down with one of Miami's most sought-after professionals, Jade Alisson. This interview delves into the intricacies of professional companionship, the importance of boundaries, and the evolving landscape of the industry.</p>
      
      <h2 class="text-2xl font-semibold text-primary-text mt-8 mb-4">Establishing Boundaries</h2>
      <p>One of the key themes of our conversation was the critical role that boundaries play in professional relationships. Jade emphasizes that clear communication from the start is what makes an engagement successful and safe for both parties.</p>
      
      <blockquote class="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-text-gray">
        "Boundaries aren't just for me; they're for the client too. They create a safe container where we both know what to expect, allowing us to focus on the connection."
      </blockquote>

      <h2 class="text-2xl font-semibold text-primary-text mt-8 mb-4">The Digital Transformation</h2>
      <p>The industry has seen a significant shift toward digital platforms. Jade discusses how technology has improved safety and transparency, allowing providers to better screen their clients and manage their schedules.</p>
      
      <p>We're also joined by New York Dominatrix Zoey Belladonna, who shares her perspective on empowerment and the psychological aspects of power dynamics in companionship.</p>

      <h2 class="text-2xl font-semibold text-primary-text mt-8 mb-4">Final Thoughts</h2>
      <p>As the industry continues to professionalize, voices like Jade's are essential in shaping a narrative of respect, safety, and genuine human connection. Stay tuned for more insights from our companion community.</p>
    `
    },
    {
        id: 2,
        title: "Modern Companionship: A Guide",
        slug: "modern-companionship-guide",
        description: "Exploring the evolution of companion services and what to expect in the modern era.",
        image: "/images/blog2.png",
        readTime: "8 min read",
        author: "Rosey Team",
        date: "Feb 08, 2026",
        content: `
      <p>Modern companionship has moved far beyond outdated stereotypes. In today's fast-paced world, the need for genuine connection, companionship, and emotional support is more prevalent than ever.</p>
      
      <h2 class="text-2xl font-semibold text-primary-text mt-8 mb-4">What is Modern Companionship?</h2>
      <p>Today, a professional companion is someone who provides not just physical presence, but also conversation, social accompaniment, and emotional rapport. Whether it's a gala event or a quiet evening in, the modern companion is versatile and professional.</p>
      
      <h2 class="text-2xl font-semibold text-primary-text mt-8 mb-4">The Role of Platforms</h2>
      <p>Platforms like Rosey have revolutionized how individuals find and connect with providers. By prioritizing safety, verification, and user experience, we're building a community based on trust and transparency.</p>
    `
    },
    {
        id: 3,
        title: "Safety First: Booking Tips",
        slug: "safety-first-booking-tips",
        description: "Essential tips for a safe and respectful experience when booking companion services.",
        image: "/images/blog3.png",
        readTime: "10 min read",
        author: "Safety Dept",
        date: "Feb 05, 2026",
        content: `<p>Safety is our top priority at Rosey. This guide outlines the best practices for clients when engaging with professional companions.</p>`
    }
];

export default function ArticlePage() {
    const { slug } = useParams();
    const article = articles.find((a) => a.slug === slug);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article?.title,
                    text: article?.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            handleCopy();
        }
    };

    if (!article) {
        return (
            <div className="min-h-screen bg-input-bg flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl text-primary-text font-bold mb-4">Article Not Found</h1>
                    <Link href="/blog">
                        <Button className="bg-primary hover:bg-primary/90">Back to Blog</Button>
                    </Link>
                </div>
            </div>
        );
    }

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
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <span>{article.readTime}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-primary-text leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-xl text-text-gray leading-relaxed max-w-4xl">
                        {article.description}
                    </p>
                </div>


                <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>


                <article className="prose prose-invert prose-primary max-w-none">
                    <div
                        className="text-text-gray text-base leading-relaxed space-y-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>


                <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-primary-text">Did you find this helpful?</h3>
                        <p className="text-text-gray-opacity text-sm">Share this article with your connection.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="rounded-full border-white/20 text-text-gray hover:bg-white/10 px-8 flex items-center gap-2 w-full sm:w-auto"
                            onClick={handleCopy}
                        >
                            <Copy size={16} />
                            Copy Link
                        </Button>
                        <Button
                            className="rounded-full bg-primary hover:bg-primary/90 px-8 flex items-center gap-2 w-full sm:w-auto"
                            onClick={handleShare}
                        >
                            <Share2 size={16} />
                            Share Article
                        </Button>
                    </div>
                </div>


                <div className="mt-32">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-primary-text">Recommended for you</h2>
                        <Link href="/blog" className="text-primary hover:underline font-medium">View all articles</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.filter(a => a.id !== article.id).slice(0, 2).map((a) => (
                            <Link key={a.id} href={`/blog/${a.slug}`} className="group group-hover:no-underline">
                                <article className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden border border-white/5 h-full transition-transform hover:-translate-y-2 duration-300">
                                    <div className="relative w-full aspect-video">
                                        <Image
                                            src={a.image}
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
                                            {a.description}
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
