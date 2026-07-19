"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";

interface HistoricalDataPoint {
  date: string;
  price: number;
}

interface PriceData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
}

const SUPPORTED_COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
];

export default function PriceChart({ coinId = "bitcoin" }: { coinId?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(245, 245, 235, 0.12)" : "rgba(26, 26, 26, 0.10)";
  const tickColor = isDark ? "#A0A090" : "#666666";
  const strokeColor = isDark ? "#E6CEFF" : "#034F46";

  const [activeCoinId, setActiveCoinId] = useState<string>(coinId);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [liveInfo, setLiveInfo] = useState<PriceData | null>(null);
  
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Helper to format currency values
  const formatCurrency = (val: number) => {
    if (val < 1) {
      return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
    }
    return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Fetch price history from our local dynamic endpoint
  const fetchHistory = useCallback(async (id: string) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await fetch(`/api/history/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch price history (${response.status})`);
      }
      const payload = await response.json();
      setHistoricalData(payload.data || []);
    } catch (err: any) {
      console.error(err);
      setHistoryError("Failed to load historical charting data.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Fetch current live prices
  const fetchLivePrices = useCallback(async (targetId: string) => {
    setIsPolling(true);
    try {
      const response = await fetch("/api/prices");
      if (!response.ok) {
        throw new Error(`Prices endpoint error (${response.status})`);
      }
      const payload = await response.json();
      const allPrices: PriceData[] = payload.data || [];
      const match = allPrices.find((c) => c.id === targetId);
      if (match) {
        setLiveInfo(match);
      }
    } catch (err) {
      console.error("Live price polling error:", err);
    } finally {
      setTimeout(() => setIsPolling(false), 800);
    }
  }, []);

  // Handle coin changes and initial mount
  useEffect(() => {
    fetchHistory(activeCoinId);
    fetchLivePrices(activeCoinId);
  }, [activeCoinId, fetchHistory, fetchLivePrices]);

  // Set up 15-second interval polling for the active coin
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLivePrices(activeCoinId);
    }, 15000);

    return () => clearInterval(interval);
  }, [activeCoinId, fetchLivePrices]);

  // Handle Selector clicks
  const handleCoinSelect = (id: string) => {
    setActiveCoinId(id);
  };

  const activeCoinName = SUPPORTED_COINS.find((c) => c.id === activeCoinId)?.name || "";

  return (
    <div className="flex flex-col gap-6">
      {/* Coin Selector row & Live indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Row of buttons */}
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_COINS.map((coin) => {
            const isActive = coin.id === activeCoinId;
            return (
              <button
                key={coin.id}
                onClick={() => handleCoinSelect(coin.id)}
                className={`px-4 py-2 text-xs font-bold rounded-btn transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-brand text-ink border border-border-hairline hover:bg-brand-hover"
                    : "bg-background text-text-muted border border-border-hairline-soft hover:bg-background-deep hover:text-ink"
                }`}
              >
                {coin.name}
              </button>
            );
          })}
        </div>

        {/* Polling Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isPolling ? "bg-accent" : "bg-success"
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isPolling ? "bg-accent" : "bg-success"
            }`} />
          </div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {isPolling ? "Syncing..." : "Live Feed"}
          </span>
        </div>
      </div>

      {/* Live Readout Panel */}
      {liveInfo && (
        <div className="flex items-baseline gap-3.5 mt-2">
          <span className="font-sans font-bold text-3xl tracking-tight text-ink">
            {formatCurrency(liveInfo.price)}
          </span>
          <span
            className={`font-sans font-bold text-xs px-2.5 py-0.5 rounded-pill ${
              liveInfo.change24h >= 0
                ? "text-success bg-success/15 border border-success/20"
                : "text-danger bg-danger/15 border border-danger/20"
            }`}
          >
            {liveInfo.change24h >= 0 ? "+" : ""}
            {liveInfo.change24h.toFixed(2)}%
          </span>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            24h live readout
          </span>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="relative h-80 w-full bg-background rounded-card border border-border-hairline-soft p-4">
        {historyLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-xs rounded-card">
            <RefreshCw className="w-8 h-8 text-ink animate-spin mb-2" />
            <span className="text-xs text-text-muted font-semibold">
              Loading {activeCoinName} history...
            </span>
          </div>
        ) : historyError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background rounded-card text-center p-6">
            <AlertCircle className="w-9 h-9 text-danger mb-2" />
            <div className="text-sm font-bold text-ink mb-1">
              Data Fetch Failed
            </div>
            <div className="text-xs text-text-muted max-w-xs mb-4">
              {historyError}
            </div>
            <button
              onClick={() => fetchHistory(activeCoinId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-background border border-border-hairline rounded-btn text-xs font-bold text-ink hover:bg-background-deep transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Fetch
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={historicalData}
              margin={{ top: 16, right: 12, left: -16, bottom: 4 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke={gridColor}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 10, fontWeight: 700 }}
                dx={-8}
                domain={["auto", "auto"]}
                tickFormatter={(v) =>
                  v >= 1000
                    ? `$${(v / 1000).toFixed(0)}k`
                    : `$${v.toFixed(v < 1 ? 4 : 2)}`
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as HistoricalDataPoint;
                    return (
                      <div className="bg-[#034F46] text-[#FFFFEB] p-3 rounded-card border border-white/10 shadow-lg font-sans">
                        <div className="text-[9px] text-[#FFFFEB]/70 font-bold uppercase tracking-wider">
                          {data.date}
                        </div>
                        <div className="text-sm font-extrabold mt-1">
                          {formatCurrency(data.price)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPrice)"
                activeDot={{ r: 5, strokeWidth: 0, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
