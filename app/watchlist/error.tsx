"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Watchlist error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar Minimal */}
      <header className="w-full border-b border-border-hairline-soft bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-sans font-bold text-xl tracking-tight text-ink">
              PulseBoard<span className="text-accent font-black">.</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-background-deep border border-border-hairline-soft rounded-card p-8 text-center">
          <div className="w-14 h-14 rounded-card bg-danger/10 flex items-center justify-center text-danger mx-auto mb-6">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="font-serif font-semibold text-2xl text-ink tracking-tight mb-3">
            Watchlist Offline
          </h2>

          <p className="text-text-muted text-sm leading-relaxed mb-8">
            We couldn't load the watchlist right now. Try again in a moment.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-background bg-ink rounded-btn hover:bg-ink-darkest transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-ink bg-background border border-border-hairline rounded-btn hover:bg-background-deep transition-all"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
