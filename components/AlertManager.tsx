"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { BellRing, X, ArrowUp, ArrowDown } from "lucide-react";

interface AlertRow {
  id: string;
  user_email: string;
  coin_id: string;
  target_price: number;
  direction: "above" | "below";
  triggered: boolean;
}

interface PricePoint {
  id: string;
  name: string;
  symbol: string;
  price: number;
}

interface ToastItem {
  id: string;
  message: string;
  coinName: string;
  direction: "above" | "below";
  targetPrice: number;
  currentPrice: number;
}

const COIN_NAMES: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  cardano: "Cardano",
  dogecoin: "Dogecoin",
};

export default function AlertManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Track triggered alert IDs client-side to prevent duplicate notifications during network latency
  const triggeredAlertIdsRef = useRef<Set<string>>(new Set());

  // Periodically read the email from local storage (handles updates when alert widget sets email)
  useEffect(() => {
    const checkEmail = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("pulseboard_user_email");
        if (stored !== userEmail) {
          setUserEmail(stored ? stored.trim().toLowerCase() : null);
        }
      }
    };

    checkEmail();
    const emailInterval = setInterval(checkEmail, 2000);
    return () => clearInterval(emailInterval);
  }, [userEmail]);

  // Remove toast by id
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check alerts against prices
  const checkAlerts = useCallback(async () => {
    if (!userEmail) return;

    try {
      // 1. Fetch active alerts for this user
      const { data: alerts, error: alertsError } = await supabase
        .from("alerts")
        .select("id, user_email, coin_id, target_price, direction, triggered")
        .eq("user_email", userEmail)
        .eq("triggered", false);

      if (alertsError) {
        console.error("AlertManager could not fetch alerts:", alertsError.message);
        return;
      }

      if (!alerts || alerts.length === 0) return;

      // Filter out alerts we've already marked triggered in the current session
      const activeAlerts = (alerts as AlertRow[]).filter(
        (a) => !triggeredAlertIdsRef.current.has(a.id)
      );

      if (activeAlerts.length === 0) return;

      // 2. Fetch current prices
      const response = await fetch("/api/prices");
      if (!response.ok) return;

      const payload = await response.json();
      const currentPrices: PricePoint[] = payload.data || [];

      // 3. Process each alert
      for (const alert of activeAlerts) {
        const coinPriceObj = currentPrices.find((p) => p.id === alert.coin_id);
        if (!coinPriceObj) continue;

        const currentPrice = coinPriceObj.price;
        const target = Number(alert.target_price);
        let conditionMet = false;

        if (alert.direction === "above" && currentPrice >= target) {
          conditionMet = true;
        } else if (alert.direction === "below" && currentPrice <= target) {
          conditionMet = true;
        }

        if (conditionMet) {
          // Prevent duplicate firing instantly
          triggeredAlertIdsRef.current.add(alert.id);

          // Update triggered flag in Supabase
          const { error: updateError } = await supabase
            .from("alerts")
            .update({ triggered: true })
            .eq("id", alert.id);

          if (updateError) {
            console.error("Failed to mark alert as triggered:", updateError.message);
            // Rollback local tracking to retry on the next interval
            triggeredAlertIdsRef.current.delete(alert.id);
            continue;
          }

          // Trigger a toast notification
          const coinName = COIN_NAMES[alert.coin_id] || alert.coin_id;
          const toastId = Math.random().toString(36).substring(2, 9);
          
          const dirMessage = alert.direction === "above" ? "risen above" : "dropped below";
          const message = `${coinName} has ${dirMessage} your target price of $${target.toLocaleString()}`;

          setToasts((prev) => [
            ...prev,
            {
              id: toastId,
              message,
              coinName,
              direction: alert.direction,
              targetPrice: target,
              currentPrice,
            },
          ]);

          // Auto-remove toast after 5 seconds
          setTimeout(() => {
            removeToast(toastId);
          }, 5000);
        }
      }
    } catch (err) {
      console.error("Error running alert checker loop:", err);
    }
  }, [userEmail, removeToast]);

  // Set up polling loop matching our 15s interval
  useEffect(() => {
    checkAlerts(); // Run initially
    const intervalId = setInterval(checkAlerts, 15000);
    return () => clearInterval(intervalId);
  }, [checkAlerts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-background border border-border-hairline rounded-btn p-4 shadow-xl flex items-start gap-3.5 animate-in slide-in-from-bottom-5 duration-300 font-sans"
        >
          {/* Accent icon matching alert direction */}
          <div className={`w-8 h-8 rounded-card shrink-0 flex items-center justify-center border border-border-hairline-soft ${
            toast.direction === "above" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}>
            {toast.direction === "above" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </div>

          {/* Toast Message details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Price Trigger alert
              </span>
              <span className="inline-flex w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            </div>
            <p className="text-xs text-ink font-bold leading-normal mt-0.5">
              {toast.message}
            </p>
            <div className="mt-1.5 text-[9px] text-text-muted font-semibold">
              Current readout: ${toast.currentPrice.toLocaleString()}
            </div>
          </div>

          {/* Close trigger button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="text-text-muted/65 hover:text-ink cursor-pointer shrink-0 mt-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
