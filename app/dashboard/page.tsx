import Navbar from "@/components/Navbar";
import { fetchCryptoPrices, COIN_LOGOS } from "@/lib/prices";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import PriceChart from "@/components/PriceChart";
import Image from "next/image";

export const dynamic = "force-dynamic";

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
  const { data: prices, timestamp } = await fetchCryptoPrices();
  const lastUpdatedStr = new Date(timestamp).toLocaleTimeString();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Reusable Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
              Live Market Dashboard
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Real-time prices from CoinGecko &bull; Updated at {lastUpdatedStr}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white border border-border text-xs font-medium text-text-secondary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live Feed Active
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {prices.map((coin) => {
            const isPositive = coin.change24h >= 0;
            const changeStr = `${isPositive ? "+" : ""}${coin.change24h.toFixed(2)}%`;

            return (
              <div
                key={coin.id}
                className="flex flex-col justify-between bg-white border border-border rounded-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div>
                  {/* Name and Symbol with Logo */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={COIN_LOGOS[coin.id] || "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"}
                        alt={`${coin.name} logo`}
                        width={32}
                        height={32}
                        className="rounded-full bg-surface border border-border"
                      />
                      <div className="flex flex-col">
                        <span className="font-sans font-semibold text-text-secondary text-[10px] uppercase tracking-wider leading-none">
                          {coin.symbol}
                        </span>
                        <span className="font-sans font-bold text-text-primary text-sm mt-0.5 leading-none">
                          {coin.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Price */}
                  <div className="font-sans font-bold text-2xl tracking-tight text-text-primary">
                    {formatPrice(coin.price)}
                  </div>
                </div>

                {/* 24h Change & Market Cap */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-0.5 text-sm font-bold ${
                      isPositive ? "text-success" : "text-danger"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {changeStr}
                  </div>
                  <div className="text-xs text-text-secondary font-medium">
                    MCap {formatMarketCap(coin.marketCap)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price History Placeholder */}
        <div className="bg-white border border-border rounded-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-card bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg text-text-primary">
                Price History
              </h2>
              <p className="text-xs text-text-secondary">
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
