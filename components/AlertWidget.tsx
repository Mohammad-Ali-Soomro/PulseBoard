"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, BellRing, Plus, Check, Loader2, AlertCircle, X } from "lucide-react";

interface AlertWidgetProps {
  coinId: string;
  currentPrice: number;
}

export default function AlertWidget({ coinId, currentPrice }: AlertWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [email, setEmail] = useState("");
  const [hasStoredEmail, setHasStoredEmail] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load stored email on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("pulseboard_user_email");
      if (storedEmail) {
        setEmail(storedEmail);
        setHasStoredEmail(true);
      }
    }
  }, []);

  // Pre-fill target price when form opens
  const handleToggle = () => {
    if (!isOpen) {
      setTargetPrice(currentPrice.toString());
      setStatus(null);
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const cleanEmail = email.trim().toLowerCase();
    const priceNum = parseFloat(targetPrice);

    if (!cleanEmail) {
      setStatus({ type: "error", message: "Enter a valid email" });
      setLoading(false);
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setStatus({ type: "error", message: "Enter a valid price" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("alerts").insert({
        user_email: cleanEmail,
        coin_id: coinId,
        target_price: priceNum,
        direction: direction,
        triggered: false,
      });

      if (error) throw error;

      // Save email locally
      if (typeof window !== "undefined") {
        localStorage.setItem("pulseboard_user_email", cleanEmail);
        document.cookie = `pulseboard_user_email=${cleanEmail}; path=/; max-age=31536000; SameSite=Lax`;
        setHasStoredEmail(true);
      }

      setStatus({
        type: "success",
        message: `Alert configured for $${priceNum}`,
      });

      // Auto-close form after a success indicator delay
      setTimeout(() => {
        setIsOpen(false);
        setStatus(null);
      }, 1800);
    } catch (err: any) {
      console.error("Error setting price alert:", err);
      setStatus({
        type: "error",
        message: err.message || "Failed to set alert",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 text-left">
      {/* Set Alert Trigger button */}
      {!isOpen ? (
        <button
          onClick={handleToggle}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-text-muted bg-background hover:bg-background-deep border border-border-hairline-soft rounded-pill transition-colors cursor-pointer"
        >
          <Bell className="w-3 h-3 text-text-muted" />
          Set Alert
        </button>
      ) : (
        // Alert Form Container
        <div className="bg-background border border-border-hairline rounded-input p-4 relative animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 border-b border-border-hairline-soft pb-1.5">
            <span className="text-[10px] font-bold text-ink uppercase tracking-wider flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-accent" />
              Configure Alert
            </span>
            <button
              onClick={handleToggle}
              className="text-text-muted hover:text-ink cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Direction Selection */}
            <div>
              <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                Trigger When Price
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDirection("above")}
                  className={`py-1 text-[10px] font-bold rounded-btn transition-colors cursor-pointer border ${
                    direction === "above"
                      ? "bg-brand text-ink border-border-hairline"
                      : "bg-background text-text-muted border-border-hairline-soft hover:bg-background-deep"
                  }`}
                >
                  Goes Above
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("below")}
                  className={`py-1 text-[10px] font-bold rounded-btn transition-colors cursor-pointer border ${
                    direction === "below"
                      ? "bg-brand text-ink border-border-hairline"
                      : "bg-background text-text-muted border-border-hairline-soft hover:bg-background-deep"
                  }`}
                >
                  Drops Below
                </button>
              </div>
            </div>

            {/* Target Price input */}
            <div>
              <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                Target Price (USD)
              </label>
              <input
                type="number"
                step="any"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-background border border-border-hairline rounded-input text-xs text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
              />
            </div>

            {/* Email field (only shown if not saved in local storage) */}
            {!hasStoredEmail && (
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
                  className="w-full px-2.5 py-1.5 bg-background border border-border-hairline rounded-input text-xs text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
                />
              </div>
            )}

            {/* Actions */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover disabled:opacity-60 transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Save Alert
                </>
              )}
            </button>
          </form>

          {/* Form statuses feedback */}
          {status && (
            <div
              className={`mt-2 p-2 rounded-input flex items-start gap-1.5 text-[9px] font-semibold border ${
                status.type === "success"
                  ? "bg-success/15 text-success border-success/20"
                  : "bg-danger/15 text-danger border-danger/20"
              }`}
            >
              {status.type === "success" ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
