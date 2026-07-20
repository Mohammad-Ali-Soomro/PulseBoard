"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, RefreshCw, AlertCircle, DollarSign, Calendar, Sliders } from "lucide-react";
import { useTheme } from "next-themes";

const SUPPORTED_COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
];

const TIMEFRAMES = [
  { days: "30", label: "Last 30 Days" },
  { days: "90", label: "Last 90 Days" },
  { days: "180", label: "Last 180 Days" },
];

interface BacktestChartPoint {
  date: string;
  strategyValue: number;
  buyAndHoldValue: number;
  price: number;
}

interface BacktestResult {
  coinId: string;
  timeframe: string;
  strategyType: string;
  totalInvested: number;
  finalValue: number;
  percentageReturn: number;
  buyAndHoldReturn: number;
  chartData: BacktestChartPoint[];
}

export default function BacktestPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(245, 245, 235, 0.12)" : "rgba(26, 26, 26, 0.10)";
  const tickColor = isDark ? "#A0A090" : "#666666";

  // Colors: Lavender brand/accent vs slate/gray
  const strategyStrokeColor = isDark ? "#E6CEFF" : "#6B21A8";
  const buyAndHoldStrokeColor = isDark ? "#A0A090" : "#666666";

  const [coinId, setCoinId] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("90");
  const [strategyType, setStrategyType] = useState("dca");
  const [dipPercentage, setDipPercentage] = useState("5");
  const [dcaIntervalDays, setDcaIntervalDays] = useState("7");

  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBacktest = useCallback(async () => {
    setLoading(true);
    setError(null);

    const strategyParams: Record<string, string> = {};
    if (strategyType === "dip_buyer") {
      strategyParams.dipPercentage = dipPercentage;
    } else if (strategyType === "dca") {
      strategyParams.dcaIntervalDays = dcaIntervalDays;
    }

    try {
      const res = await fetch("/api/backtest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coinId,
          timeframe,
          strategyType,
          strategyParams,
        }),
      });

      if (!res.ok) {
        const errPayload = await res.json();
        throw new Error(errPayload.error || "Simulation run failed.");
      }

      const payload = await res.json();
      setResult(payload);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to execute backtesting simulation.");
    } finally {
      setLoading(false);
    }
  }, [coinId, timeframe, strategyType, dipPercentage, dcaIntervalDays]);

  // Run on initial mount
  useEffect(() => {
    runBacktest();
  }, [runBacktest]);

  const activeCoinName = SUPPORTED_COINS.find((c) => c.id === coinId)?.name || coinId;
  const isProfit = result ? result.percentageReturn >= 0 : false;
  const isBetterThanBah = result ? result.percentageReturn > result.buyAndHoldReturn : false;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Reusable Navbar */}
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-ink tracking-tight">
            Strategy Backtester
          </h1>
          <p className="text-text-muted text-sm mt-2 leading-relaxed font-sans">
            Test simple algorithmic accumulation models against historical data and compare directly with Buy and Hold.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parameters Form Panel */}
          <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-ink" />
              <h2 className="font-serif font-semibold text-lg text-ink">
                Model Parameters
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runBacktest();
              }}
              className="space-y-4"
            >
              {/* Asset Selection */}
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

              {/* Timeframe Selection */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border-hairline rounded-input text-sm text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring appearance-none cursor-pointer"
                >
                  {TIMEFRAMES.map((t) => (
                    <option key={t.days} value={t.days}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Strategy Selector */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Accumulation Strategy
                </label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border-hairline rounded-input text-sm text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring appearance-none cursor-pointer"
                >
                  <option value="buy_and_hold">Buy & Hold (Standard)</option>
                  <option value="dca">Dollar Cost Averaging (DCA)</option>
                  <option value="dip_buyer">Statistical Dip Buyer</option>
                </select>
              </div>

              {/* Dynamic Strategy Sub-Inputs */}
              {strategyType === "dca" && (
                <div className="p-4 bg-background border border-border-hairline-soft rounded-card space-y-3 animate-in fade-in duration-200">
                  <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    DCA Interval (Days)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/65">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      required
                      value={dcaIntervalDays}
                      onChange={(e) => setDcaIntervalDays(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background-deep border border-border-hairline rounded-input text-xs text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
                    />
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Invests $100 regularly every {dcaIntervalDays || "N"} days.
                  </p>
                </div>
              )}

              {strategyType === "dip_buyer" && (
                <div className="p-4 bg-background border border-border-hairline-soft rounded-card space-y-3 animate-in fade-in duration-200">
                  <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    Dip Threshold (%)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/65">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      max="50"
                      required
                      value={dipPercentage}
                      onChange={(e) => setDipPercentage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background-deep border border-border-hairline rounded-input text-xs text-ink focus:outline-hidden focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
                    />
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Buys $100 worth when price drops {dipPercentage || "X"}% below previous local peak.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand border border-border-hairline rounded-btn font-sans font-bold text-sm text-ink hover:bg-brand-hover disabled:opacity-50 cursor-pointer select-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  "Run Backtest"
                )}
              </button>
            </form>
          </div>

          {/* Results Presentation Area */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-danger/10 border border-danger/25 rounded-card p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-danger text-sm">
                    Simulation Failed
                  </h3>
                  <p className="text-xs text-danger/80 mt-1 leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Scorecard Summary */}
                <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                        Simulation Return
                      </span>
                      <h2
                        className={`font-serif font-bold text-4xl sm:text-5xl mt-1 tracking-tight ${
                          isProfit ? "text-success" : "text-danger"
                        }`}
                      >
                        {isProfit ? "+" : ""}{result.percentageReturn}%
                      </h2>
                    </div>

                    <div className="bg-background border border-border-hairline-soft/65 rounded-card p-4 text-xs font-sans space-y-1.5">
                      <div className="flex justify-between gap-6">
                        <span className="text-text-muted">Total Invested:</span>
                        <span className="font-bold text-ink">${result.totalInvested.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-text-muted">Final Value:</span>
                        <span className="font-bold text-ink">${result.finalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-6 pt-1 border-t border-border-hairline-soft">
                        <span className="text-text-muted">Buy & Hold:</span>
                        <span className={`font-bold ${result.buyAndHoldReturn >= 0 ? "text-success" : "text-danger"}`}>
                          {result.buyAndHoldReturn >= 0 ? "+" : ""}{result.buyAndHoldReturn}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Relative Performance Callout */}
                  <div className="mt-6 pt-4 border-t border-border-hairline-soft flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <p className="text-xs text-text-muted font-medium font-sans">
                      {isBetterThanBah ? (
                        <>
                          This strategy <strong className="text-ink">beat</strong> buy and hold by{" "}
                          <strong className="text-success">
                            {(result.percentageReturn - result.buyAndHoldReturn).toFixed(2)}%
                          </strong>{" "}
                          over the same timeframe.
                        </>
                      ) : (
                        <>
                          This strategy <strong className="text-ink">underperformed</strong> buy and hold by{" "}
                          <strong className="text-danger">
                            {Math.abs(result.percentageReturn - result.buyAndHoldReturn).toFixed(2)}%
                          </strong>.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Line Chart Comparison */}
                <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6">
                  <div className="mb-4">
                    <h3 className="font-serif font-semibold text-lg text-ink">
                      Value Comparison Over Time
                    </h3>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Daily tracking of portfolio value (USD) based on standard $100 accumulation logs
                    </p>
                  </div>

                  <div className="h-64 w-full bg-background rounded-card border border-border-hairline-soft p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={result.chartData}
                        margin={{ top: 5, right: 10, left: -22, bottom: 0 }}
                      >
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
                          tick={{ fill: tickColor, fontSize: 8, fontWeight: 700 }}
                          dy={6}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: tickColor, fontSize: 8, fontWeight: 700 }}
                          dx={-6}
                          domain={["auto", "auto"]}
                          tickFormatter={(v) => `$${v.toFixed(0)}`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-[#1A1A1A] text-[#FFFFEB] p-2.5 rounded-card border border-white/10 shadow-lg font-sans">
                                  <div className="text-[8px] text-[#FFFFEB]/70 font-bold uppercase tracking-wider">
                                    {data.date}
                                  </div>
                                  <div className="text-xs font-extrabold mt-1 text-[#FFA946]">
                                    Strategy: ${data.strategyValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </div>
                                  <div className="text-xs font-extrabold mt-0.5 text-text-muted">
                                    Buy & Hold: ${data.buyAndHoldValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </div>
                                  <div className="text-[8px] text-[#FFFFEB]/60 mt-1">
                                    Price: ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          iconSize={10}
                          iconType="circle"
                          wrapperStyle={{ fontSize: 10, fontFamily: "sans-serif", fontWeight: 700 }}
                        />
                        <Line
                          name="Selected Strategy"
                          type="monotone"
                          dataKey="strategyValue"
                          stroke={strategyStrokeColor}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                        <Line
                          name="Buy & Hold (Baseline)"
                          type="monotone"
                          dataKey="buyAndHoldValue"
                          stroke={buyAndHoldStrokeColor}
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* Disclaimer */}
            <p className="text-[9px] text-text-muted italic leading-relaxed text-center">
              Based on historical price data. Not financial advice. Past performance is no guarantee of future results.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
