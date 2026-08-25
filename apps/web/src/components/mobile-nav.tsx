"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/assistant", label: "Assistant" },
  { href: "/upload", label: "Upload" },
  { href: "/insights", label: "Insights" },
  { href: "/architecture", label: "Architecture" },
  { href: "/ai", label: "AI" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-archive"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-archive/50" onClick={() => setOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 bg-observatory p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display text-xl font-semibold text-paper mb-6 px-3">
              Research Nexus AI
            </div>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 flex-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors ${
                    pathname === link.href
                      ? "bg-signal/10 text-signal font-medium"
                      : "text-paper/70 hover:bg-paper/5 hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-3 pb-4">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
