"use client";

import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Header() {
    const [activeNav, setActiveNav] = useState("Home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useCurrentUser();
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);
    const router = useRouter();
    const isEscort = (user?.role ?? "").toLowerCase() === "escort";

    const handleAuthAction = () => {
        if (user) {
            clearUser();
            router.push("/");
            return;
        }

        router.push("/login"); // Or open login modal if that's the preferred UX
    };

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
    ];

    return (
        <header className="flex px-4 pt-4 md:px-[60px] md:pt-[60px] z-50 relative">
            <div className="w-full md:hidden">
                <section className="flex w-full items-center justify-between rounded-[200px] bg-primary-text px-4 py-3">
                    <Link href="/" className="inline-flex items-center">
                        <span className="text-primary text-3xl font-normal petemoss md:hidden">
                            Rosey
                        </span>
                        <Image
                            src="/images/logo.svg"
                            alt="Rosey"
                            width={47}
                            height={25}
                            className="hidden md:block"
                            priority
                        />
                    </Link>
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a]"
                        aria-label="Toggle menu"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </section>
                {isMobileMenuOpen && (
                    <div className="mt-3 rounded-[24px] bg-primary-text p-4 shadow-lg absolute left-4 right-4 z-50">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/blog"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-[200px] bg-tag-bg px-4 py-2 text-sm font-medium text-primary-text"
                            >
                                Blog
                            </Link>
                            <div className="flex items-center gap-2 rounded-[200px] border border-[#E5E5EA] px-3 py-3">
                                <Search size={16} color={"#8E8E93"} />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                                {isEscort && (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="rounded-[200px] bg-primary px-6 py-3 text-sm font-semibold text-primary-text text-center w-full"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    onClick={handleAuthAction}
                                    className="rounded-[200px] bg-primary px-6 py-3 text-sm font-semibold text-primary-text cursor-pointer w-full"
                                >
                                    {user ? "Sign out" : "Login / Signup"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <section className="hidden w-full justify-between rounded-[200px] bg-primary-text p-4 md:flex items-center">
                <Link href="/" className="inline-flex items-center">
                    <span className="text-primary text-3xl md:text-[32px] font-normal petemoss">
                        Rosey
                    </span>
                    {/* <Image
            src="/images/logo.svg"
            alt="Rosey"
            width={121}
            height={35}
            className="h-auto"
            priority
          /> */}
                </Link>

                <div className=" flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setActiveNav(link.label)}
                            className={`text-base font-medium transition-colors ${activeNav === link.label
                                    ? "bg-primary rounded-[200px] py-2 px-[33px] text-primary-text"
                                    : "text-[#8E8E93]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <section className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-[200px] px-3 py-3  border border-[#E5E5EA] w-[290px]">
                        <Search size={16} color={"#8E8E93"} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-32 bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {isEscort && (
                            <Link
                                href="/dashboard"
                                className="cursor-pointer rounded-[200px] border border-primary px-[24px] py-[12px] text-primary text-base font-semibold whitespace-nowrap hover:bg-primary/10 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={handleAuthAction}
                            className="cursor-pointer rounded-[200px] bg-primary px-[31px] py-[13px] text-primary-text text-base font-semibold whitespace-nowrap"
                        >
                            {user ? "Sign out" : "Login / Signup"}
                        </button>
                    </div>
                </section>
            </section>
        </header>
    );
}
