import Link from "next/link";
import { Activity, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Centered Navbar */}
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
              href="#dashboard"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="#watchlist"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Watchlist
            </Link>
            <Link
              href="#about"
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-32 sm:pt-36 sm:pb-40">
          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-surface border border-border text-xs font-semibold text-text-primary tracking-wide uppercase mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Telemetry Engine v1.0
            </div>

            {/* Giant Headline */}
            <h1 className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl text-text-primary tracking-tight leading-[1.05] max-w-4xl mx-auto">
              Markets, live.<br />Decisions, instant.
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              PulseBoard puts real-time telemetry, automated tracking, and high-fidelity charting in one clean workspace. Built for modern operators.
            </p>

            {/* Hero CTA */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary rounded-pill hover:opacity-95 hover:shadow-lg hover:shadow-primary/20 active:scale-98 transition-all"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-text-secondary bg-surface border border-border rounded-pill hover:text-text-primary hover:bg-border/30 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid (100px+ vertical spacing) */}
        <section id="features" className="py-28 sm:py-36 border-t border-border bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Capabilities</h2>
              <p className="text-3xl font-bold text-text-primary tracking-tight sm:text-4xl">
                Engineered for rapid analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="flex flex-col bg-white border border-border rounded-card p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-card bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Real-time Telemetry</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Tick-by-tick market updates, sub-second chart rendering, and automated streaming feeds.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="flex flex-col bg-white border border-border rounded-card p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-card bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Smart Watchlists</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Track and organize assets dynamically. Get instant triggers on structural volume shifts.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="flex flex-col bg-white border border-border rounded-card p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-card bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Secured Nodes</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Your workspace is local-first and encrypted. Fully sandboxed data for complete privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section (on light gray background band) */}
        <section className="bg-surface border-y border-border py-28 sm:py-36">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-text-primary tracking-tight sm:text-5xl mb-6">
              Ready to pulse?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get immediate access to live telemetry and start building your watchlist. No credit card required.
            </p>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary rounded-pill hover:opacity-95 hover:shadow-lg hover:shadow-primary/20 active:scale-98 transition-all"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Clean minimal footer */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold tracking-tight text-text-primary">
              PulseBoard &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
