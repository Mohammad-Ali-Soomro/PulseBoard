"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Loader2, Plus, X, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchCoinResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export default function CoinSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchCoinResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [email, setEmail] = useState("");
  const [hasStoredEmail, setHasStoredEmail] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<SearchCoinResult | null>(null);
  
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for email on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("pulseboard_user_email");
      if (storedEmail) {
        setEmail(storedEmail);
        setHasStoredEmail(true);
      }
    }
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const payload = await res.json();
          setResults(payload.data || []);
        }
      } catch (err) {
        console.error("Coin search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCoin = async (coin: SearchCoinResult) => {
    setStatus(null);
    
    // If we don't have an email stored, open the email prompt overlay/flow
    if (!hasStoredEmail && !email.trim()) {
      setSelectedCoin(coin);
      setShowEmailPrompt(true);
      return;
    }

    const targetEmail = (hasStoredEmail ? email : email.trim()).toLowerCase();

    try {
      setSearching(true);
      
      const { error } = await supabase
        .from("user_coins")
        .insert({ user_email: targetEmail, coin_id: coin.id });

      if (error) {
        if (error.code === "23505") {
          throw new Error(`${coin.name} is already in your tracked list.`);
        }
        throw error;
      }

      // Save email locally and in cookies
      if (typeof window !== "undefined") {
        localStorage.setItem("pulseboard_user_email", targetEmail);
        document.cookie = `pulseboard_user_email=${targetEmail}; path=/; max-age=31536000; SameSite=Lax`;
        setHasStoredEmail(true);
      }

      setStatus({
        type: "success",
        message: `Successfully tracked ${coin.name}`,
      });

      // Clear search states
      setQuery("");
      setResults([]);
      setSelectedCoin(null);
      setShowEmailPrompt(false);

      // Refresh page data
      router.refresh();
      
      // Auto-clear success message
      setTimeout(() => setStatus(null), 2500);
    } catch (err: any) {
      console.error("Error tracking coin:", err);
      setStatus({
        type: "error",
        message: err.message || "Failed to add coin to list",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCoin) {
      handleAddCoin(selectedCoin);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto mb-8 relative" ref={dropdownRef}>
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/65">
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          placeholder="Search and add coins (e.g. Ripple, Cosmos, Chainlink...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-background-deep border border-border-hairline rounded-input text-sm text-ink placeholder:text-text-muted/50 focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted/65 hover:text-ink cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Overlay Results */}
      {results.length > 0 && (
        <div className="absolute z-40 left-0 right-0 mt-2 bg-background border border-border-hairline rounded-card shadow-xl max-h-64 overflow-y-auto font-sans">
          {results.map((coin) => (
            <button
              key={coin.id}
              onClick={() => handleAddCoin(coin)}
              className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-background-deep border-b border-border-hairline-soft/40 last:border-0 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={coin.thumb}
                  alt={`${coin.name} thumb`}
                  width={24}
                  height={24}
                  className="rounded-full bg-background border border-border-hairline-soft"
                />
                <div>
                  <span className="font-bold text-ink text-sm block leading-none">
                    {coin.name}
                  </span>
                  <span className="text-[10px] text-text-muted font-bold tracking-wide uppercase mt-1 block">
                    {coin.symbol}
                  </span>
                </div>
              </div>
              <div className="p-1 rounded-full bg-background-deep hover:bg-brand/35 text-text-muted hover:text-ink border border-border-hairline-soft">
                <Plus className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Email Prompt Overlay Modal */}
      {showEmailPrompt && selectedCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/45 backdrop-blur-xs p-4">
          <div className="bg-background border border-border-hairline rounded-card p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowEmailPrompt(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-semibold text-lg text-ink">
                Tracking Identity Needed
              </h3>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Please enter your operator email. This will store your tracked list of coins securely on Supabase so you can view it on return.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Operator Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="operator@pulseboard.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-background-deep border border-border-hairline rounded-input text-xs text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover cursor-pointer"
              >
                Track {selectedCoin.name}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Status banners */}
      {status && (
        <div
          className={`absolute z-35 -bottom-10 left-0 right-0 p-2 rounded-input flex items-center justify-center gap-1.5 text-[10px] font-bold border shadow-md animate-in slide-in-from-top-1 ${
            status.type === "success"
              ? "bg-success/15 text-success border-success/20"
              : "bg-danger/15 text-danger border-danger/20"
          }`}
        >
          {status.type === "success" ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
