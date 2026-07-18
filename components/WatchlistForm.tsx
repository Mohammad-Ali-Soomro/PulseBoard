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
        // Handle duplicate entries constraint error code: 23505 (unique_violation)
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
      
      // Request Next.js server to refresh data in the background
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
    <div className="bg-white border border-border rounded-card p-6 shadow-sm max-w-xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="font-sans font-bold text-lg text-text-primary">
          Join Watchlist
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Add your email to track custom assets and monitor live market indicators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="e.g. operator@pulseboard.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Dropdown Input */}
        <div>
          <label htmlFor="coin" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Select Asset
          </label>
          <select
            id="coin"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
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
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-primary rounded-pill hover:opacity-95 active:scale-98 disabled:opacity-60 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
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
          className={`mt-4 p-4 rounded-lg flex items-start gap-2.5 text-xs font-semibold ${
            status.type === "success"
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
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
