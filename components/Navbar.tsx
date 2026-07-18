import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-card bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-text-primary">
            PulseBoard<span className="text-primary font-black">.</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Watchlist
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-pill hover:opacity-90 active:scale-98 transition-all shadow-sm shadow-primary/10"
          >
            Launch Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
