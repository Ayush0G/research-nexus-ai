"use client";

import { ReactNode } from "react";
import { Navigation } from "./navigation";
import { MobileNav } from "./mobile-nav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper text-archive">
      <aside className="hidden lg:flex w-[var(--sidebar-width)] flex-col border-r border-archive/8 bg-observatory text-paper sticky top-0 h-screen">
        <Navigation />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center border-b border-archive/8 bg-white px-4 h-14">
          <MobileNav />
          <span className="ml-3 font-display text-lg">Research Nexus AI</span>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
