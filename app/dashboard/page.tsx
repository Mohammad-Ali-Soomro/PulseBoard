import Navbar from "@/components/Navbar";
import { fetchCryptoPrices, COIN_LOGOS } from "@/lib/prices";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import PriceChart from "@/components/PriceChart";
import Image from "next/image";
import AlertWidget from "@/components/AlertWidget";
import AlertManager from "@/components/AlertManager";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import CoinSearch from "@/components/CoinSearch";
import RemoveCoinButton from "@/components/RemoveCoinButton";
import UnusualActivity from "@/components/UnusualActivity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Market Dashboard",
  description: "Monitor live prices and historical trends for Bitcoin, Ethereum, Solana, and other major assets.",
};

function formatPrice(price: number): string {
  if (price < 1) {
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  }
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMarketCap(val: number): string {
  if (val >= 1e12) {
    return `$${(val / 1e12).toFixed(2)}T`;
  }
  if (val >= 1e9) {
    return `$${(val / 1e9).toFixed(2)}B`;
  }
  if (val >= 1e6) {
    return `$${(val / 1e6).toFixed(2)}M`;
  }
  return `$${val.toLocaleString()}`;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("pulseboard_user_email")?.value;
  let coinIds: string | undefined = undefined;

  // Retrieve user custom coins from Supabase if email is set in cookies
  if (userEmail) {
    try {
      const { data, error } = await supabase
        .from("user_coins")
        .select("coin_id")
        .eq("user_email", userEmail.trim().toLowerCase());

      if (!error && data && data.length > 0) {
        coinIds = data.map((item) => item.coin_id).join(",");
      }
    } catch (err) {
      console.error("Failed to load user tracked coins from Supabase:", err);
    }
  }

  const { data: prices, timestamp } = await fetchCryptoPrices(coinIds);
  const lastUpdatedStr = new Date(timestamp).toLocaleTimeString();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Reusable Navbar */}
      <Navbar />

      {/* Background Alert Listener & Notification Toast Trigger */}
      <AlertManager />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-ink tracking-tight">
              Live Market Dashboard
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Real-time prices from CoinGecko &bull; Updated at {lastUpdatedStr}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-background-deep border border-border-hairline-soft text-xs font-semibold text-text-muted shadow-xs">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live Feed Active
          </div>
        </div>

        {/* Dynamic Search & Track input */}
        <CoinSearch />

        {/* Unusual Activity anomalies check */}
        <UnusualActivity coinIds={coinIds} />

        {/* Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {prices.map((coin) => {
            const isPositive = coin.change24h >= 0;
            const changeStr = `${isPositive ? "+" : ""}${coin.change24h.toFixed(2)}%`;

            return (
              <div
                key={coin.id}
                className="flex flex-col justify-between bg-background-deep border border-border-hairline-soft rounded-card p-6"
              >
                <div>
                  {/* Name and Symbol with Logo */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Image
                        src={coin.image || COIN_LOGOS[coin.id] || "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"}
                        alt={`${coin.name} logo`}
                        width={32}
                        height={32}
                        className="rounded-full bg-background border border-border-hairline-soft shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-sans font-semibold text-text-muted text-[10px] uppercase tracking-wider leading-none">
                          {coin.symbol}
                        </span>
                        <span className="font-sans font-bold text-ink text-sm mt-0.5 leading-none truncate">
                          {coin.name}
                        </span>
                      </div>
                    </div>
                    {/* Delete action button */}
                    <RemoveCoinButton coinId={coin.id} coinName={coin.name} />
                  </div>

                  {/* Current Price */}
                  <div className="font-sans font-bold text-xl tracking-tight text-ink">
                    {formatPrice(coin.price)}
                  </div>

                  {/* Set Price Alerts Form Widget */}
                  <AlertWidget coinId={coin.id} currentPrice={coin.price} />
                </div>

                {/* 24h Change & Market Cap */}
                <div className="mt-6 pt-4 border-t border-border-hairline-soft flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                      isPositive ? "text-success" : "text-danger"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {changeStr}
                  </div>
                  <div className="text-[10px] text-text-muted font-bold">
                    MCap {formatMarketCap(coin.marketCap)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price History Placeholder */}
        <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center text-ink border border-border-hairline-soft">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-xl text-ink">
                Price History
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Historical performance over the last 7 days
              </p>
            </div>
          </div>

          <PriceChart coinId="bitcoin" />
        </div>
      </main>
    </div>
  );
}

