// "use client";

// import { Search } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FooterSection } from "@/components/home/footer-section";

// const categories = ["Interview", "Adult", "Sex Talk", "Lifestyle"];

// const hotArticles = [
//   {
//     id: 1,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog1.png",
//     readTime: "12 min read",
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog2.png",
//     readTime: "12 min read",
//     featured: false,
//   },
//   {
//     id: 3,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog3.png",
//     readTime: "12 min read",
//     featured: false,
//   },
// ];

// const featuredArticles = [
//   {
//     id: 4,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog1.png",
//     readTime: "12 min read",
//   },
//   {
//     id: 5,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog2.png",
//     readTime: "12 min read",
//   },
//   {
//     id: 6,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog3.png",
//     readTime: "12 min read",
//   },
//   {
//     id: 7,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog1.png",
//     readTime: "12 min read",
//   },
// ];

// export default function BlogPage() {
//   const [activeNav, setActiveNav] = useState("Blog");

//   const navLinks = [
//     { label: "Home", href: "/" },
//     { label: "Blog", href: "/blog" },
//   ];

//   return (
//     <section className="flex flex-col min-h-screen bg-input-bg">
//       {/* Header */}
//       <header className="flex px-4 md:px-[60px] pt-4 md:pt-[60px] pb-20">
//         <section className="flex justify-between bg-primary-text rounded-[200px] px-4 py-5 w-full">
//           <Link href="/" className="inline-flex items-center">
//             <span className="text-primary text-3xl md:text-[32px] font-normal petemoss">
//               Rosey
//             </span>
//           </Link>

//           <div className="flex items-center gap-10">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 onClick={() => setActiveNav(link.label)}
//                 className={`text-base font-medium transition-colors ${
//                   activeNav === link.label
//                     ? "bg-primary rounded-[200px] py-2 px-[33px] text-primary-text"
//                     : "text-[#8E8E93]"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           <section className="flex items-center gap-2">
//             <div className="flex items-center gap-2 rounded-[200px] px-3 py-3 border border-[#E5E5EA] w-[290px]">
//               <Search size={16} color={"#8E8E93"} />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-32 bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
//               />
//             </div>
//             <div className="flex items-center bg-primary rounded-[200px] px-[31px] py-[13px]">
//               <p className="text-primary-text text-base font-semibold">Login</p>
//               <p className="text-primary-text text-base font-semibold">/</p>
//               <p className="text-primary-text text-base font-semibold">
//                 Signup
//               </p>
//             </div>
//           </section>
//         </section>
//       </header>

//       {/* Hero Section */}
//       <div className="flex flex-col items-center  px-4 md:px-[60px] ">
//         <div className=" flex flex-col gap-[24px]">
//           <p className=" text-text-gray-opacity font-semibold text-[24px] text-center">
//             Blog
//           </p>
//           <div className="flex items-center gap-4 md:gap-8">
//             <span className="text-primary text-2xl md:text-4xl">✨</span>
//             <h1 className="text-3xl md:text-5xl lg:text-[72px] font-semibold text-primary-text text-center">
//               Insights, Stories & Guidance for Modern Companionship
//             </h1>
//             <span className="text-primary text-2xl md:text-4xl">✨</span>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="w-full max-w-2xl pt-8 md:pt-16">
//           <div className="relative flex items-center">
//             <Search
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-gray-opacity z-10"
//               size={20}
//             />
//             <Input
//               type="text"
//               placeholder="Search blog title"
//               className="pl-12 pr-16 bg-primary-bg text-white placeholder:text-text-gray-opacity rounded-[200px] w-full"
//             />
//             <button className="absolute right-2 rounded-full p-3 bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
//               <Search className="h-5 w-5 text-white" size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Categories */}
//         {/* <div className="flex flex-wrap justify-center gap-4 md:gap-6">
//           {categories.map((category) => (
//             <Link
//               key={category}
//               href="#"
//               className="text-text-gray text-sm md:text-base hover:text-primary transition-colors"
//             >
//               {category}
//             </Link>
//           ))}
//         </div> */}
//         <div className=" flex text-primary pt-4 ">
//           <p className=" text-base font-normal ">
//             <span className="text-primary-text">Categories: </span>
//             Interviews, Articles, Sex Talk, LifeStyle
//           </p>
//         </div>
//       </div>

//       {/* Hot Section */}
//       <div className="px-4 md:px-[60px] py-20 ">
//         <h2 className="text-2xl md:text-3xl font-semibold text-primary-text mb-6 md:mb-8 flex items-center gap-2">
//           Hot 🔥
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//           {/* Large Featured Article - Left Side */}
//           <article className="md:col-span-2 flex flex-col bg-primary-bg rounded-3xl overflow-hidden">
//             <div className="relative w-full aspect-4/3">
//               <Image
//                 src={hotArticles[0].image}
//                 alt={hotArticles[0].title}
//                 fill
//                 className="object-cover rounded-t-3xl"
//               />
//             </div>
//             <div className="flex flex-col gap-4 p-4 md:p-6">
//               <div className="flex flex-col gap-2">
//                 <h3 className="text-lg md:text-xl font-semibold text-primary-text">
//                   {hotArticles[0].title}
//                 </h3>
//                 <p className="text-sm md:text-base font-normal text-text-gray-opacity">
//                   {hotArticles[0].description}
//                 </p>
//               </div>
//               <div className="flex items-center justify-between mt-auto">
//                 <Link
//                   href="#"
//                   className="text-primary text-sm md:text-base font-medium underline"
//                 >
//                   Read Article
//                 </Link>
//                 <span className="text-sm md:text-base text-text-gray-opacity">
//                   {hotArticles[0].readTime}
//                 </span>
//               </div>
//             </div>
//           </article>

//           {/* Two Smaller Articles - Right Side */}
//           <div className="flex flex-col gap-4 md:gap-6">
//             {hotArticles.slice(1).map((article) => (
//               <article
//                 key={article.id}
//                 className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden"
//               >
//                 <div className="relative w-full aspect-square">
//                   <Image
//                     src={article.image}
//                     alt={article.title}
//                     fill
//                     className="object-cover rounded-t-3xl"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-4 p-4 md:p-6">
//                   <div className="flex flex-col gap-2">
//                     <h3 className="text-lg md:text-xl font-semibold text-primary-text">
//                       {article.title}
//                     </h3>
//                     <p className="text-sm md:text-base font-normal text-text-gray-opacity">
//                       {article.description}
//                     </p>
//                   </div>
//                   <div className="flex items-center justify-between mt-auto">
//                     <Link
//                       href="#"
//                       className="text-primary text-sm md:text-base font-medium underline"
//                     >
//                       Read Article
//                     </Link>
//                     <span className="text-sm md:text-base text-text-gray-opacity">
//                       {article.readTime}
//                     </span>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Featured Articles Section */}
//       <div className="px-4 md:px-[60px] ">
//         <h2 className="text-2xl md:text-3xl font-semibold text-primary-text mb-6 md:mb-8 flex items-center gap-2">
//           🔥 Featured Articles
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//           {featuredArticles.map((article) => (
//             <article
//               key={article.id}
//               className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden"
//             >
//               <div className="relative w-full aspect-3/4">
//                 <Image
//                   src={article.image}
//                   alt={article.title}
//                   fill
//                   className="object-cover rounded-t-3xl"
//                 />
//               </div>
//               <div className="flex flex-col gap-4 p-4 md:p-6">
//                 <div className="flex flex-col gap-2">
//                   <h3 className="text-lg md:text-xl font-semibold text-primary-text">
//                     {article.title}
//                   </h3>
//                   <p className="text-sm md:text-base font-normal text-text-gray-opacity">
//                     {article.description}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between mt-auto">
//                   <Link
//                     href="#"
//                     className="text-primary text-sm md:text-base font-medium underline"
//                   >
//                     Read Article
//                   </Link>
//                   <span className="text-sm md:text-base text-text-gray-opacity">
//                     {article.readTime}
//                   </span>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>

//       {/* Load More Button */}
//       <div className="flex justify-center px-4 md:px-[60px] py-8 md:py-12">
//         <Button variant="default" size="lg" className="px-8 py-6">
//           Load More Posts
//         </Button>
//       </div>

//       {/* Footer */}
//       <FooterSection />
//     </section>
//   );
// }

// "use client";

// import { Search } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FooterSection } from "@/components/home/footer-section";

// const categories = ["Interview", "Adult", "Sex Talk", "Lifestyle"];

// const hotArticles = [
//   {
//     id: 1,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog1.png",
//     readTime: "12 min read",
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog2.png",
//     readTime: "12 min read",
//     featured: false,
//   },
//   {
//     id: 3,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog3.png",
//     readTime: "12 min read",
//     featured: false,
//   },
// ];

// const featuredArticles = [
//   {
//     id: 4,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog1.png",
//     readTime: "12 min read",
//   },
//   {
//     id: 5,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog2.png",
//     readTime: "12 min read",
//   },
//   {
//     id: 6,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog3.png",
//     readTime: "12 min read",
//   },
//   {
//     id: 7,
//     title: "Interview with Miami Escort Jade Alisson",
//     description:
//       "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
//     image: "/images/blog1.png",
//     readTime: "12 min read",
//   },
// ];

// export default function BlogPage() {
//   const [activeNav, setActiveNav] = useState("Blog");

//   const navLinks = [
//     { label: "Home", href: "/" },
//     { label: "Blog", href: "/blog" },
//   ];

//   return (
//     <section className="flex flex-col min-h-screen bg-input-bg">
//       {/* Header */}
//       <header className="flex px-4 md:px-[60px] pt-4 md:pt-[60px] pb-20">
//         <section className="flex justify-between bg-primary-text rounded-[200px] px-4 py-5 w-full">
//           <Link href="/" className="inline-flex items-center">
//             <span className="text-primary text-3xl md:text-[32px] font-normal petemoss">
//               Rosey
//             </span>
//           </Link>

//           <div className="flex items-center gap-10">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 onClick={() => setActiveNav(link.label)}
//                 className={`text-base font-medium transition-colors ${
//                   activeNav === link.label
//                     ? "bg-primary rounded-[200px] py-2 px-[33px] text-primary-text"
//                     : "text-[#8E8E93]"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           <section className="flex items-center gap-2">
//             <div className="flex items-center gap-2 rounded-[200px] px-3 py-3 border border-[#E5E5EA] w-[290px]">
//               <Search size={16} color={"#8E8E93"} />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-32 bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
//               />
//             </div>
//             <div className="flex items-center bg-primary rounded-[200px] px-[31px] py-[13px]">
//               <p className="text-primary-text text-base font-semibold">Login</p>
//               <p className="text-primary-text text-base font-semibold">/</p>
//               <p className="text-primary-text text-base font-semibold">
//                 Signup
//               </p>
//             </div>
//           </section>
//         </section>
//       </header>

//       {/* Hero Section */}
//       <div className="flex flex-col items-center  px-4 md:px-[60px] ">
//         <div className=" flex flex-col gap-[24px]">
//           <p className=" text-text-gray-opacity font-semibold text-[24px] text-center">
//             Blog
//           </p>
//           <div className="flex items-center gap-4 md:gap-8">
//             <span className="text-primary text-2xl md:text-4xl">✨</span>
//             <h1 className="text-3xl md:text-5xl lg:text-[72px] font-semibold text-primary-text text-center">
//               Insights, Stories & Guidance for Modern Companionship
//             </h1>
//             <span className="text-primary text-2xl md:text-4xl">✨</span>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="w-full max-w-2xl pt-8 md:pt-16">
//           <div className="relative flex items-center">
//             <Search
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-gray-opacity z-10"
//               size={20}
//             />
//             <Input
//               type="text"
//               placeholder="Search blog title"
//               className="pl-12 pr-16 bg-primary-bg text-white placeholder:text-text-gray-opacity rounded-[200px] w-full"
//             />
//             <button className="absolute right-2 rounded-full p-3 bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
//               <Search className="h-5 w-5 text-white" size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className=" flex text-primary pt-4 ">
//           <p className=" text-base font-normal ">
//             <span className="text-primary-text">Categories: </span>
//             Interviews, Articles, Sex Talk, LifeStyle
//           </p>
//         </div>
//       </div>

//       {/* Hot Section */}
//       <div className="px-4 md:px-[60px] py-20 ">
//         <h2 className="text-2xl md:text-3xl font-semibold text-primary-text mb-6 md:mb-8 flex items-center gap-2">
//           Hot 🔥
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//           {/* Large Featured Article - Left Side */}
//           <article className="md:col-span-2 flex flex-col bg-primary-bg rounded-3xl overflow-hidden h-full">
//             <div className="relative w-full h-[400px] md:h-[500px]">
//               <Image
//                 src={hotArticles[0].image}
//                 alt={hotArticles[0].title}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="flex flex-col gap-4 p-4 md:p-6 flex-grow">
//               <div className="flex flex-col gap-2">
//                 <h3 className="text-lg md:text-xl font-semibold text-primary-text">
//                   {hotArticles[0].title}
//                 </h3>
//                 <p className="text-sm md:text-base font-normal text-text-gray-opacity">
//                   {hotArticles[0].description}
//                 </p>
//               </div>
//               <div className="flex items-center justify-between mt-auto">
//                 <Link
//                   href="#"
//                   className="text-primary text-sm md:text-base font-medium underline"
//                 >
//                   Read Article
//                 </Link>
//                 <span className="text-sm md:text-base text-text-gray-opacity">
//                   {hotArticles[0].readTime}
//                 </span>
//               </div>
//             </div>
//           </article>

//           {/* Two Smaller Articles - Right Side */}
//           <div className="flex flex-col gap-4 md:gap-6">
//             {hotArticles.slice(1).map((article) => (
//               <article
//                 key={article.id}
//                 className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden"
//               >
//                 <div className="relative w-full h-[180px] md:h-[200px]">
//                   <Image
//                     src={article.image}
//                     alt={article.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-4 p-4 md:p-6">
//                   <div className="flex flex-col gap-2">
//                     <h3 className="text-base md:text-lg font-semibold text-primary-text">
//                       {article.title}
//                     </h3>
//                     <p className="text-xs md:text-sm font-normal text-text-gray-opacity line-clamp-2">
//                       {article.description}
//                     </p>
//                   </div>
//                   <div className="flex items-center justify-between mt-auto">
//                     <Link
//                       href="#"
//                       className="text-primary text-xs md:text-sm font-medium underline"
//                     >
//                       Read Article
//                     </Link>
//                     <span className="text-xs md:text-sm text-text-gray-opacity">
//                       {article.readTime}
//                     </span>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Featured Articles Section */}
//       <div className="px-4 md:px-[60px] ">
//         <h2 className="text-2xl md:text-3xl font-semibold text-primary-text mb-6 md:mb-8 flex items-center gap-2">
//           🔥 Featured Articles
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//           {featuredArticles.map((article) => (
//             <article
//               key={article.id}
//               className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden"
//             >
//               <div className="relative w-full h-[300px] md:h-[400px]">
//                 <Image
//                   src={article.image}
//                   alt={article.title}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="flex flex-col gap-4 p-4 md:p-6">
//                 <div className="flex flex-col gap-2">
//                   <h3 className="text-lg md:text-xl font-semibold text-primary-text">
//                     {article.title}
//                   </h3>
//                   <p className="text-sm md:text-base font-normal text-text-gray-opacity">
//                     {article.description}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between mt-auto">
//                   <Link
//                     href="#"
//                     className="text-primary text-sm md:text-base font-medium underline"
//                   >
//                     Read Article
//                   </Link>
//                   <span className="text-sm md:text-base text-text-gray-opacity">
//                     {article.readTime}
//                   </span>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>

//       {/* Load More Button */}
//       <div className="flex justify-center px-4 md:px-[60px] py-8 md:py-12">
//         <Button variant="default" size="lg" className="px-8 py-6">
//           Load More Posts
//         </Button>
//       </div>

//       {/* Footer */}
//       <FooterSection />
//     </section>
//   );
// }

"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FooterSection } from "@/components/home/footer-section";

const categories = ["Interview", "Adult", "Sex Talk", "Lifestyle"];

const hotArticles = [
  {
    id: 1,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog2.png",
    readTime: "12 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog3.png",
    readTime: "12 min read",
    featured: false,
  },
];

const featuredArticles = [
  {
    id: 4,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
  {
    id: 5,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog2.png",
    readTime: "12 min read",
  },
  {
    id: 6,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog3.png",
    readTime: "12 min read",
  },
  {
    id: 7,
    title: "Interview with Miami Escort Jade Alisson",
    description:
      "We're joined by New York Dominatrix Zoey Belladonna to talk freedom, boundaries, and feeling powerful.",
    image: "/images/blog1.png",
    readTime: "12 min read",
  },
];

export default function BlogPage() {
  const [activeNav, setActiveNav] = useState("Blog");

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <section className="flex flex-col min-h-screen bg-input-bg">
      {/* Header */}
      <header className="flex px-4 md:px-[60px] pt-4 md:pt-[60px] pb-20">
        <section className="flex justify-between bg-primary-text rounded-[200px] px-4 py-5 w-full">
          <Link href="/" className="inline-flex items-center">
            <span className="text-primary text-3xl md:text-[32px] font-normal petemoss">
              Rosey
            </span>
          </Link>

          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`text-base font-medium transition-colors ${
                  activeNav === link.label
                    ? "bg-primary rounded-[200px] py-2 px-[33px] text-primary-text"
                    : "text-[#8E8E93]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <section className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-[200px] px-3 py-3 border border-[#E5E5EA] w-[290px]">
              <Search size={16} color={"#8E8E93"} />
              <input
                type="text"
                placeholder="Search"
                className="w-32 bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
              />
            </div>
            <div className="flex items-center bg-primary rounded-[200px] px-[31px] py-[13px]">
              <p className="text-primary-text text-base font-semibold">Login</p>
              <p className="text-primary-text text-base font-semibold">/</p>
              <p className="text-primary-text text-base font-semibold">
                Signup
              </p>
            </div>
          </section>
        </section>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center  px-4 md:px-[60px] ">
        <div className=" flex flex-col gap-[24px]">
          <p className=" text-text-gray-opacity font-semibold text-[24px] text-center">
            Blog
          </p>
          <div className="flex items-center gap-4 md:gap-8">
            <Image
              src="/svg/flower.svg"
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 md:h-8 md:w-8"
            />
            <h1 className="text-3xl md:text-5xl lg:text-[72px] font-semibold text-primary-text text-center">
              Insights, Stories & Guidance for Modern Companionship
            </h1>
            <Image
              src="/svg/flower.svg"
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 md:h-8 md:w-8"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl pt-8 md:pt-16">
          <div className="relative flex items-center">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-gray-opacity z-10"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search blog title"
              className="pl-12 pr-16 bg-primary-bg text-white placeholder:text-text-gray-opacity rounded-[200px] w-full"
            />
            <button className="absolute right-2 rounded-full p-3 bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Search className="h-5 w-5 text-white" size={16} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className=" flex text-primary pt-4 ">
          <p className=" text-base font-normal ">
            <span className="text-primary-text">Categories: </span>
            Interviews, Articles, Sex Talk, LifeStyle
          </p>
        </div>
      </div>

      {/* Hot Section */}
      <div className="px-4 md:px-[60px] py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-text mb-6 md:mb-8 flex items-center gap-2">
          Hot 🔥
        </h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Large Featured Article - Left Side */}
          <article className="flex-1 flex flex-col bg-primary-bg rounded-3xl overflow-hidden">
            <div className="relative w-full aspect-video">
              <Image
                src={hotArticles[0].image}
                alt={hotArticles[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-primary-text">
                  {hotArticles[0].title}
                </h3>
                <p className="text-base font-normal text-text-gray-opacity">
                  {hotArticles[0].description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href="#"
                  className="text-primary text-base font-medium underline"
                >
                  Read Article
                </Link>
                <span className="text-base text-text-gray-opacity">
                  {hotArticles[0].readTime}
                </span>
              </div>
            </div>
          </article>

          {/* Two Smaller Articles - Right Side */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            {hotArticles.slice(1).map((article) => (
              <article
                key={article.id}
                className="flex flex-row bg-primary-bg rounded-3xl overflow-hidden h-[calc(50%-12px)]"
              >
                <div className="relative w-[40%] shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-6 grow justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-primary-text">
                      {article.title}
                    </h3>
                    <p className="text-sm font-normal text-text-gray-opacity line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href="#"
                      className="text-primary text-sm font-medium underline"
                    >
                      Read Article
                    </Link>
                    <span className="text-sm text-text-gray-opacity">
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      <div className="px-4 md:px-[60px] ">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-text mb-6 md:mb-8 flex items-center gap-2">
          🔥 Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              className="flex flex-col bg-primary-bg rounded-3xl overflow-hidden"
            >
              <div className="relative w-full h-[300px] md:h-[400px]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg md:text-xl font-semibold text-primary-text">
                    {article.title}
                  </h3>
                  <p className="text-sm md:text-base font-normal text-text-gray-opacity">
                    {article.description}
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
                    {article.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="flex justify-center px-4 md:px-[60px] py-8 md:py-12">
        <Button variant="default" size="lg" className="px-8 py-6">
          Load More Posts
        </Button>
      </div>

      {/* Footer */}
      <FooterSection />
    </section>
  );
}
