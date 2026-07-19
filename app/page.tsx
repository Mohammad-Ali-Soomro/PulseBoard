import Link from "next/link";
import { Activity, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Centered Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-32 sm:pt-36 sm:pb-40">
          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-background-deep border border-border-hairline-soft text-xs font-semibold text-ink tracking-wide uppercase mb-8 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live Telemetry Engine
            </div>

            {/* Giant Headline */}
            <h1 className="font-serif font-semibold text-6xl sm:text-7xl md:text-8xl text-ink tracking-tight leading-[1.05] max-w-4xl mx-auto">
              Markets, live.<br />Decisions, instant.
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              PulseBoard puts real-time telemetry, automated tracking, and high-fidelity charting in one clean workspace. Built for modern operators.
            </p>

            {/* Hero CTA */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover transition-all"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-ink bg-background border border-border-hairline rounded-btn hover:bg-background-deep transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid (100px+ vertical spacing) */}
        <section id="features" className="py-28 sm:py-36 border-t border-border-hairline-soft bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-sm font-bold text-ink uppercase tracking-widest mb-3">Capabilities</h2>
              <p className="text-4xl font-serif font-semibold text-ink tracking-tight">
                Engineered for rapid analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="flex flex-col bg-background-deep border border-border-hairline-soft rounded-card p-8">
                <div className="w-12 h-12 rounded-card bg-background flex items-center justify-center text-ink mb-6 border border-border-hairline-soft">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-ink mb-3">Real-time Telemetry</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Tick-by-tick market updates, sub-second chart rendering, and automated streaming feeds.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="flex flex-col bg-background-deep border border-border-hairline-soft rounded-card p-8">
                <div className="w-12 h-12 rounded-card bg-background flex items-center justify-center text-ink mb-6 border border-border-hairline-soft">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-ink mb-3">Smart Watchlists</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Track and organize assets dynamically. Get instant triggers on structural volume shifts.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="flex flex-col bg-background-deep border border-border-hairline-soft rounded-card p-8">
                <div className="w-12 h-12 rounded-card bg-background flex items-center justify-center text-ink mb-6 border border-border-hairline-soft">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-ink mb-3">Secured Nodes</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Your workspace is local-first and encrypted. Fully sandboxed data for complete privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section (on light gray/lemon deep background band) */}
        <section className="bg-background-deep border-y border-border-hairline-soft py-28 sm:py-36">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-serif font-semibold text-ink tracking-tight mb-6">
              Ready to pulse?
            </h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get immediate access to live telemetry and start building your watchlist. No credit card required.
            </p>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover transition-all"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Clean minimal footer */}
      <footer className="bg-background border-t border-border-hairline-soft py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-ink" />
            <span className="text-xs font-semibold tracking-tight text-ink">
              PulseBoard &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-text-muted hover:text-ink transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-text-muted hover:text-ink transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
