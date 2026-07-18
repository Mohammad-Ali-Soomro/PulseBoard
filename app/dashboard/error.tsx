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
    // Log the error to an error reporting service
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Navbar Minimal */}
      <header className="w-full border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-sans font-bold text-xl tracking-tight text-text-primary">
              PulseBoard<span className="text-primary font-black">.</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white border border-border rounded-card p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-card bg-danger/10 flex items-center justify-center text-danger mx-auto mb-6">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="font-sans font-bold text-2xl text-text-primary tracking-tight mb-3">
            Telemetry Feed Error
          </h2>

          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Failed to connect to the live market telemetry feed. This can happen if the upstream CoinGecko API is rate-limiting public requests. Please wait a moment and try again.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-pill hover:opacity-90 active:scale-98 transition-all shadow-sm shadow-primary/10"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-text-secondary bg-surface border border-border rounded-pill hover:text-text-primary hover:bg-border/30 transition-all"
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
