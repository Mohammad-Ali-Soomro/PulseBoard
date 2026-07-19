import { Activity } from "lucide-react";
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Skeleton Navbar */}
      <header className="w-full border-b border-border-hairline-soft bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-card bg-brand/35 flex items-center justify-center text-ink/30 border border-border-hairline-soft">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-ink/30">
              PulseBoard<span className="text-accent/30 font-black">.</span>
            </span>
          </div>
          <div className="w-36 h-10 rounded-btn bg-background-deep/50 animate-pulse border border-border-hairline-soft" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <Skeleton className="h-9 w-64 rounded-sm" variant="deep" />
            <Skeleton className="h-4 w-48 rounded-xs mt-2" variant="deep" />
          </div>
          <div className="w-32 h-7 rounded-pill bg-background-deep/40 animate-pulse border border-border-hairline-soft" />
        </div>

        {/* Price Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between bg-background-deep border border-border-hairline-soft rounded-card p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    {/* Circle Logo Placeholder */}
                    <Skeleton className="w-8 h-8 rounded-full" variant="light" />
                    <div className="flex flex-col">
                      {/* Symbol / Name placeholders */}
                      <Skeleton className="w-8 h-2.5 rounded-xs" variant="light" />
                      <Skeleton className="w-16 h-3 rounded-xs mt-1" variant="light" />
                    </div>
                  </div>
                </div>
                {/* Price placeholder */}
                <Skeleton className="w-24 h-6 rounded-xs mt-4" variant="light" />
              </div>
              {/* Bottom row */}
              <div className="mt-8 pt-4 border-t border-border-hairline-soft flex items-center justify-between">
                <Skeleton className="w-12 h-5 rounded-pill" variant="light" />
                <Skeleton className="w-16 h-3.5 rounded-xs" variant="light" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center text-ink border border-border-hairline-soft animate-pulse">
              <Activity className="w-5 h-5 opacity-25" />
            </div>
            <div>
              <Skeleton className="w-28 h-5.5 rounded-sm" variant="light" />
              <Skeleton className="w-48 h-3.5 rounded-xs mt-1.5" variant="light" />
            </div>
          </div>
          {/* Simple pulsing rectangle matching active chart height */}
          <Skeleton className="h-80 w-full rounded-card" variant="light" />
        </div>
      </main>
    </div>
  );
}
