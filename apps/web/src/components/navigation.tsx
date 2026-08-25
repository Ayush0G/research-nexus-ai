"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/architecture", label: "Architecture" },
  { href: "/ai", label: "AI" },
];

const protectedLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/assistant", label: "Assistant" },
  { href: "/upload", label: "Upload" },
  { href: "/insights", label: "Insights" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-col h-full">
      <div className="px-6 py-5 font-display text-xl font-semibold">
        Research Nexus AI
      </div>

      <div className="flex flex-col gap-1 px-3 mt-2">
        <p className="px-3 mb-1 text-xs font-data uppercase tracking-wider text-paper/40">
          Application
        </p>
        {protectedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors ${
              pathname === link.href
                ? "bg-signal/10 text-signal font-medium"
                : "text-paper/70 hover:bg-paper/5 hover:text-paper"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-1 px-3 mt-6">
        <p className="px-3 mb-1 text-xs font-data uppercase tracking-wider text-paper/40">
          Public
        </p>
        {publicLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors ${
              pathname === link.href
                ? "bg-signal/10 text-signal font-medium"
                : "text-paper/70 hover:bg-paper/5 hover:text-paper"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mt-auto px-3 pb-4">
        <AuthButton />
      </div>
    </nav>
  );
}
