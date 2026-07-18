import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Skeleton Navbar */}
      <header className="w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-card bg-primary/20 flex items-center justify-center text-primary/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-text-primary/30">
              PulseBoard<span className="text-primary/30 font-black">.</span>
            </span>
          </div>
          <div className="w-36 h-10 rounded-pill bg-border/50 animate-pulse" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="h-9 w-64 bg-border/70 rounded animate-pulse" />
            <div className="h-4 w-48 bg-border/40 rounded mt-2 animate-pulse" />
          </div>
          <div className="w-32 h-7 rounded-pill bg-border/40 animate-pulse" />
        </div>

        {/* Price Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between bg-white border border-border rounded-card p-6 shadow-sm animate-pulse"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-8 h-4 bg-border/50 rounded" />
                  <div className="w-16 h-4 bg-border/50 rounded" />
                </div>
                <div className="w-28 h-8 bg-border/70 rounded mt-2" />
              </div>
              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <div className="w-12 h-5 bg-border/50 rounded" />
                <div className="w-16 h-4 bg-border/40 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white border border-border rounded-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 animate-pulse">
            <div className="w-10 h-10 rounded-card bg-border/50" />
            <div>
              <div className="w-28 h-6 bg-border/60 rounded" />
              <div className="w-48 h-3.5 bg-border/40 rounded mt-1.5" />
            </div>
          </div>
          <div className="h-80 w-full rounded-card bg-surface border border-dashed border-border animate-pulse" />
        </div>
      </main>
    </div>
  );
}
