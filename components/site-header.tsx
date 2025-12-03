"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AuthButton } from "./auth-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">STAGE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/discovery" className="transition-colors hover:text-primary">
            Discovery
          </Link>
          <Link href="/upload" className="transition-colors hover:text-primary">
            Upload
          </Link>
          <Link href="/profile" className="transition-colors hover:text-primary">
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
