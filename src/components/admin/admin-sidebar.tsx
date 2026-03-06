"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCheck,
  LayoutDashboard,
  Megaphone,
  Wallet,
  ScrollText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiBuilder } from "@/api/builder";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/profiles", label: "Profiles", icon: LayoutDashboard },
  { href: "/admin/verifications", label: "Verifications", icon: UserCheck },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/wallets", label: "Wallets", icon: Wallet },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await apiBuilder.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="flex h-full w-56 flex-col border-r border-dark-border bg-primary-bg">
      <div className="flex items-center gap-2 px-5 py-6 border-b border-dark-border">
        <span className="text-primary font-bold text-lg tracking-wide">Rosey</span>
        <span className="text-xs text-text-gray-opacity bg-tag-bg px-2 py-0.5 rounded-full font-medium">
          Admin
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-tag-bg text-primary"
                  : "text-text-gray-opacity hover:bg-dark-surface hover:text-primary-text"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-dark-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-gray-opacity hover:bg-dark-surface hover:text-primary-text transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
