import { Activity, Flame, Award } from "lucide-react";
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {/* Page Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-background-deep/40 text-xs font-bold text-ink/30 mb-4 border border-border-hairline-soft">
            <Flame className="w-3.5 h-3.5 text-accent opacity-25 animate-pulse" />
            Global Sentiment Tracker
          </div>
          <div className="flex justify-center mb-2">
            <Skeleton className="h-10 w-80 rounded-sm" variant="deep" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-4.5 w-96 rounded-xs mt-1" variant="deep" />
          </div>
        </div>

        {/* Leaderboard Card Skeleton */}
        <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 sm:p-8 mb-12">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center text-ink/20 border border-border-hairline-soft animate-pulse">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <Skeleton className="w-40 h-6 rounded-sm" variant="light" />
              <Skeleton className="w-64 h-3.5 rounded-xs mt-1.5" variant="light" />
            </div>
          </div>

          {/* Skeletons list */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                {/* Rank Bubble */}
                <Skeleton className="w-8 h-8 rounded-full" variant="light" />

                {/* Coin Info */}
                <div className="flex items-center gap-3 w-32 sm:w-44 shrink-0">
                  <Skeleton className="w-6 h-6 rounded-full shrink-0" variant="light" />
                  <div className="flex flex-col w-full">
                    <Skeleton className="w-16 h-4 rounded-xs" variant="light" />
                    <Skeleton className="w-10 h-3 rounded-xs mt-1" variant="light" />
                  </div>
                </div>

                {/* Progress Bar placeholder */}
                <Skeleton className="flex-1 h-5.5 rounded-full" variant="light" />
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <hr className="border-border-hairline-soft my-12" />

        {/* Join Watchlist Form Skeleton */}
        <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 max-w-xl mx-auto w-full">
          <div className="mb-6">
            <Skeleton className="w-32 h-6 rounded-sm" variant="light" />
            <Skeleton className="w-80 h-3.5 rounded-xs mt-1.5" variant="light" />
          </div>

          <div className="space-y-4">
            {/* Input 1 */}
            <div>
              <Skeleton className="w-20 h-3 rounded-xs mb-1.5" variant="light" />
              <div className="w-full h-11 bg-background rounded-input border border-border-hairline-soft animate-pulse" />
            </div>

            {/* Input 2 */}
            <div>
              <Skeleton className="w-20 h-3 rounded-xs mb-1.5" variant="light" />
              <div className="w-full h-11 bg-background rounded-input border border-border-hairline-soft animate-pulse" />
            </div>

            {/* Button */}
            <div className="w-full h-12.5 bg-brand/35 rounded-btn border border-border-hairline-soft animate-pulse mt-6" />
          </div>
        </div>
      </main>
    </div>
  );
}
