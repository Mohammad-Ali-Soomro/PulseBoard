import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
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

        {/* Nav links */}
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
            href="/#features"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover transition-all"
          >
            <span className="hidden sm:inline">Launch Dashboard</span>
            <span className="inline sm:hidden">Launch</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
