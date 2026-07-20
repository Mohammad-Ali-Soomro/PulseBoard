"use client";

import Link from "next/link";
import { Activity, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-hairline-soft bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-card bg-brand flex items-center justify-center text-ink border border-border-hairline-soft">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-ink">
            PulseBoard<span className="text-accent font-black">.</span>
          </span>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/watchlist"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
          >
            Watchlist
          </Link>
          <Link
            href="/simulator"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
          >
            Simulator
          </Link>
          <Link
            href="/backtest"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
          >
            Backtest
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right CTA Button & Theme Switcher & Menu Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover transition-all"
          >
            <span className="hidden sm:inline">Launch Dashboard</span>
            <span className="inline sm:hidden">Launch</span>
          </Link>

          {/* Hamburger Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-btn bg-background-deep border border-border-hairline-soft flex items-center justify-center text-ink hover:bg-brand/20 transition-all cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-4 h-4 animate-in fade-in duration-200" /> : <Menu className="w-4 h-4 animate-in fade-in duration-200" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-border-hairline-soft bg-background px-6 py-5 space-y-4 animate-in slide-in-from-top-3 duration-200 font-sans">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-semibold text-text-muted hover:text-ink transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/watchlist"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-semibold text-text-muted hover:text-ink transition-colors"
          >
            Watchlist
          </Link>
          <Link
            href="/simulator"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-semibold text-text-muted hover:text-ink transition-colors"
          >
            Simulator
          </Link>
          <Link
            href="/backtest"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-semibold text-text-muted hover:text-ink transition-colors"
          >
            Backtest
          </Link>
          <Link
            href="/#features"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-semibold text-text-muted hover:text-ink transition-colors"
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
