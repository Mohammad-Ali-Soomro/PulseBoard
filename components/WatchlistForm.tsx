"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Check, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SUPPORTED_COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
];

export default function WatchlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [coinId, setCoinId] = useState("bitcoin");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("watchlist")
        .insert({ user_email: cleanEmail, coin_id: coinId });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This coin is already in your watchlist!");
        }
        throw error;
      }

      setStatus({
        type: "success",
        message: `Successfully added ${SUPPORTED_COINS.find((c) => c.id === coinId)?.name} to your watchlist!`,
      });
      setEmail("");
      
      router.refresh();
    } catch (err: any) {
      console.error("Watchlist insert error:", err);
      setStatus({
        type: "error",
        message: err.message || "Failed to add coin. Please check your connection or try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 max-w-xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="font-serif font-semibold text-xl text-ink">
          Join Watchlist
        </h2>
        <p className="text-xs text-text-muted mt-1">
          Add your email to track custom assets and monitor live market indicators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="e.g. operator@pulseboard.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background border border-border-hairline rounded-input text-sm text-ink placeholder:text-text-muted/50 focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring transition-all"
          />
        </div>

        {/* Dropdown Input */}
        <div>
          <label htmlFor="coin" className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
            Select Asset
          </label>
          <select
            id="coin"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border-hairline rounded-input text-sm text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring transition-all appearance-none cursor-pointer"
          >
            {SUPPORTED_COINS.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover disabled:opacity-60 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin animate-duration-1000" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to Watchlist
            </>
          )}
        </button>
      </form>

      {/* Feedback Messages */}
      {status && (
        <div
          className={`mt-4 p-4 rounded-input flex items-start gap-2.5 text-xs font-semibold ${
            status.type === "success"
              ? "bg-success/15 text-success border border-success/20"
              : "bg-danger/15 text-danger border border-danger/20"
          }`}
        >
          {status.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
