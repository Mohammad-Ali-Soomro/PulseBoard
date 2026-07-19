"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, RefreshCw, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { useTheme } from "next-themes";

const SUPPORTED_COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
];

const TIMEFRAMES = [
  { days: "7", label: "7 Days Ago" },
  { days: "30", label: "30 Days Ago" },
  { days: "90", label: "90 Days Ago" },
];

interface HistoryPoint {
  date: string;
  price: number;
}

interface SimulationResult {
  startPrice: number;
  currentPrice: number;
  percentageChange: number;
  endingValue: number;
  isGain: boolean;
  timeframeLabel: string;
}

export default function SimulatorPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(245, 245, 235, 0.12)" : "rgba(26, 26, 26, 0.10)";
  const tickColor = isDark ? "#A0A090" : "#666666";
  const strokeColor = isDark ? "#E6CEFF" : "#034F46";

  const [coinId, setCoinId] = useState("bitcoin");
  const [investedAmount, setInvestedAmount] = useState("1000");
  const [days, setDays] = useState("30");
  
  const [historicalData, setHistoricalData] = useState<HistoryPoint[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async () => {
    const amountNum = parseFloat(investedAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid investment amount.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/history/${coinId}?days=${days}`);
      if (!response.ok) {
        throw new Error(`History API error (${response.status})`);
      }

      const payload = await response.json();
      const data: HistoryPoint[] = payload.data || [];

      if (data.length < 2) {
        throw new Error("Insufficient historical data returned for this asset.");
      }

      setHistoricalData(data);

      const startPrice = data[0].price;
      const currentPrice = data[data.length - 1].price;
      const percentageChange = ((currentPrice - startPrice) / startPrice) * 100;
      const endingValue = amountNum * (currentPrice / startPrice);
      const isGain = endingValue >= amountNum;

      const timeframeLabel = TIMEFRAMES.find((t) => t.days === days)?.label || `${days} Days Ago`;

      setResult({
        startPrice,
        currentPrice,
        percentageChange,
        endingValue,
        isGain,
        timeframeLabel,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve simulation statistics.");
    } finally {
      setLoading(false);
    }
  }, [coinId, investedAmount, days]);

  // Run on initial mount
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const activeCoinName = SUPPORTED_COINS.find((c) => c.id === coinId)?.name || coinId;
  const startAmountVal = parseFloat(investedAmount) || 0;

  // Calculate simulated value history for charting the growth curve
  const chartData = result && historicalData.length > 0
    ? historicalData.map((d) => {
        const startPrice = result.startPrice;
        const simulatedValue = startAmountVal * (d.price / startPrice);
        return {
          date: d.date,
          price: d.price,
          value: simulatedValue,
        };
      })
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Reusable Navbar */}
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-ink tracking-tight">
            Portfolio Simulator
          </h1>
          <p className="text-text-muted text-sm mt-2 leading-relaxed font-sans">
            Hypothetically look back to calculate potential returns on major digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Form */}
          <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 h-fit">
            <h2 className="font-serif font-semibold text-xl text-ink mb-4">
              Simulation Parameters
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runSimulation();
              }}
              className="space-y-4"
            >
              {/* Select Asset */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Asset
                </label>
                <select
                  value={coinId}
                  onChange={(e) => setCoinId(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border-hairline rounded-input text-sm text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring appearance-none cursor-pointer"
                >
                  {SUPPORTED_COINS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Investment Amount */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Amount Invested (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={investedAmount}
                    onChange={(e) => setInvestedAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-background border border-border-hairline rounded-input text-sm text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>

              {/* Timeframe selector */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Timeframe
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIMEFRAMES.map((t) => (
                    <button
                      key={t.days}
                      type="button"
                      onClick={() => setDays(t.days)}
                      className={`py-2.5 text-xs font-bold rounded-btn transition-colors cursor-pointer border ${
                        days === t.days
                          ? "bg-brand text-ink border-border-hairline"
                          : "bg-background text-text-muted border-border-hairline-soft hover:bg-background-deep"
                      }`}
                    >
                      {t.days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate CTA button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-ink bg-brand border border-border-hairline rounded-btn hover:bg-brand-hover disabled:opacity-60 transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Simulate
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output Block */}
          <div className="lg:col-span-2 space-y-6">
            {error ? (
              <div className="bg-background-deep border border-danger/25 rounded-card p-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-10 h-10 text-danger mb-2.5" />
                <div className="font-serif font-semibold text-lg text-ink">
                  Simulation Failed
                </div>
                <p className="text-xs text-text-muted mt-1 max-w-sm">
                  {error}
                </p>
                <button
                  onClick={runSimulation}
                  className="mt-4 px-4 py-2 border border-border-hairline text-xs font-bold text-ink bg-background rounded-btn hover:bg-background-deep cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="bg-background-deep border border-border-hairline-soft rounded-card p-12 flex flex-col items-center justify-center h-80 animate-pulse">
                <RefreshCw className="w-8 h-8 text-ink animate-spin mb-3" />
                <span className="text-xs text-text-muted font-bold">
                  Recalculating historical parameters...
                </span>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Result Card metrics */}
                <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 sm:p-8">
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    Investment Report &bull; {activeCoinName} &bull; {result.timeframeLabel}
                  </div>
                  
                  <div className="font-sans font-bold text-4xl sm:text-5xl tracking-tight text-ink mt-2">
                    ${result.endingValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-pill ${
                        result.isGain
                          ? "bg-success/15 text-success border border-success/20"
                          : "bg-danger/15 text-danger border border-danger/20"
                      }`}
                    >
                      {result.isGain ? "+" : ""}
                      {result.percentageChange.toFixed(2)}%
                    </span>
                    <span className="text-xs text-text-muted font-medium">
                      relative profit/loss shift
                    </span>
                  </div>

                  {/* Details stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border-hairline-soft text-left font-sans">
                    <div>
                      <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider">
                        Initial Asset Price
                      </span>
                      <span className="font-bold text-sm text-ink block mt-0.5">
                        ${result.startPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider">
                        Current Asset Price
                      </span>
                      <span className="font-bold text-sm text-ink block mt-0.5">
                        ${result.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Growth Curve Chart */}
                <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6">
                  <div className="mb-4">
                    <h3 className="font-serif font-semibold text-lg text-ink">
                      Growth Curve
                    </h3>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Hypothetical portfolio valuation progress over time (USD)
                    </p>
                  </div>

                  <div className="h-64 w-full bg-background rounded-card border border-border-hairline-soft p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 12, right: 10, left: -22, bottom: 2 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                          tick={{ fill: tickColor, fontSize: 9, fontWeight: 700 }}
                          dy={6}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: tickColor, fontSize: 9, fontWeight: 700 }}
                          dx={-6}
                          domain={["auto", "auto"]}
                          tickFormatter={(v) => `$${v.toFixed(0)}`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-[#034F46] text-[#FFFFEB] p-2.5 rounded-card border border-white/10 shadow-lg font-sans">
                                  <div className="text-[8px] text-[#FFFFEB]/70 font-bold uppercase tracking-wider">
                                    {data.date}
                                  </div>
                                  <div className="text-xs font-extrabold mt-1">
                                    Value: ${Number(data.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                  <div className="text-[8px] text-[#FFFFEB]/60 mt-0.5">
                                    Coin: ${Number(data.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={strokeColor}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                          activeDot={{ r: 4.5, strokeWidth: 0, fill: strokeColor }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-text-muted leading-relaxed text-center">
                  Hypothetical only, based on historical price data. Not financial advice.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
