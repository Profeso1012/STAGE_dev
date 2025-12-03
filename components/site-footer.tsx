"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <div className="container max-w-screen-2xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">STAGE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Decentralized talent discovery powered by Camp Network.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Navigation</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/discovery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discovery
              </Link>
              <Link href="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Upload
              </Link>
              <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </Link>
              <Link href="/premium" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Premium
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Resources</h4>
            <nav className="flex flex-col gap-2">
              <a href="https://camp.network" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Camp Network
              </a>
              <a href="https://docs.camp.network" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@stage.camp"
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {currentYear} STAGE. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
