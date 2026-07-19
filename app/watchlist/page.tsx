import Navbar from "@/components/Navbar";
import WatchlistForm from "@/components/WatchlistForm";
import { supabase } from "@/lib/supabase";
import { Award, Eye, Flame } from "lucide-react";
import Image from "next/image";
import { COIN_LOGOS } from "@/lib/prices";

export const revalidate = 60; // Incremental Static Regeneration (ISR) - 60s TTL

export const metadata = {
  title: "Sentiment Leaderboard",
  description: "Global asset sentiment and trending watchlists aggregated across the PulseBoard operator network.",
};

const COIN_NAMES: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  cardano: "Cardano",
  dogecoin: "Dogecoin",
};

interface MostWatchedCoin {
  coin_id: string;
  watch_count: number;
}

// Fetch aggregate popularity statistics from the Supabase view
async function getMostWatchedCoins(): Promise<MostWatchedCoin[]> {
  try {
    const { data, error } = await supabase
      .from("most_watched_coins")
      .select("coin_id, watch_count");

    if (error) {
      console.warn("Could not retrieve stats from Supabase view. Falling back to default list.", error.message);
      return [];
    }

    if (!data) return [];

    return data.map((item) => ({
      coin_id: item.coin_id,
      watch_count: Number(item.watch_count || 0),
    }));
  } catch (err) {
    console.error("Supabase watchlist stats fetch failed:", err);
    return [];
  }
}

export default async function WatchlistPage() {
  const rawWatchedStats = await getMostWatchedCoins();

  // Ensure all supported coins are present in the list, even if they have 0 votes
  const allCoinsMap: Record<string, number> = {
    bitcoin: 0,
    ethereum: 0,
    solana: 0,
    cardano: 0,
    dogecoin: 0,
  };

  rawWatchedStats.forEach((stat) => {
    if (stat.coin_id in allCoinsMap) {
      allCoinsMap[stat.coin_id] = stat.watch_count;
    }
  });

  // Convert map to sorted array
  const sortedStats = Object.keys(allCoinsMap)
    .map((id) => ({
      id,
      name: COIN_NAMES[id] || id,
      count: allCoinsMap[id],
    }))
    .sort((a, b) => b.count - a.count);

  // Compute divisor and total watches
  const maxWatchCount = Math.max(...sortedStats.map((item) => item.count), 1);
  const totalWatches = sortedStats.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Reusable Navbar */}
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-accent/20 text-xs font-bold text-ink mb-4 border border-border-hairline-soft">
            <Flame className="w-3.5 h-3.5 text-accent" />
            Global Sentiment Tracker
          </div>
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-ink tracking-tight">
            Sentiment Leaderboard
          </h1>
          <p className="text-text-muted text-sm mt-2 leading-relaxed">
            See which assets are currently trending and being watched the most by the PulseBoard operator network.
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center text-ink border border-border-hairline-soft animate-pulse">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-xl text-ink">
                Most Watched Coins
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Aggregated sentiment rank updated every 60 seconds
              </p>
            </div>
          </div>

          {/* Leaderboard List or Empty State */}
          {totalWatches === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Eye className="w-8 h-8 text-text-muted mb-3 opacity-30" />
              <p className="text-sm text-text-muted font-medium">
                Nothing here yet. Add a coin to start tracking it.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedStats.map((item, index) => {
                const rank = index + 1;
                const relativePercent = (item.count / maxWatchCount) * 100;

                return (
                  <div key={item.id} className="flex items-center gap-4">
                    {/* Rank Number */}
                    <div className="w-8 h-8 rounded-full bg-background border border-border-hairline-soft flex items-center justify-center font-sans font-bold text-sm text-ink shrink-0">
                      {rank}
                    </div>

                    {/* Coin Name and Info with Logo */}
                    <div className="flex items-center gap-3 w-32 sm:w-44 shrink-0">
                      <Image
                        src={COIN_LOGOS[item.id] || "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"}
                        alt={`${item.name} logo`}
                        width={24}
                        height={24}
                        className="rounded-full bg-background border border-border-hairline-soft shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-sans font-bold text-sm sm:text-base text-ink block truncate leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5 leading-none">
                          {item.count} {item.count === 1 ? "watch" : "watches"}
                        </span>
                      </div>
                    </div>

                    {/* Visual Popularity Bar */}
                    <div className="flex-1 bg-background h-5.5 rounded-full overflow-hidden border border-border-hairline-soft relative flex items-center px-1">
                      <div
                        className="bg-brand h-3.5 rounded-full transition-all duration-500 border border-border-hairline-soft"
                        style={{ width: `${Math.max(relativePercent, 2)}%` }}
                      />
                    </div>

                    {/* Eye Icon indicator */}
                    <div className="hidden sm:flex items-center text-text-muted/60 gap-1 shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator line */}
        <hr className="border-border-hairline-soft my-12" />

        {/* Client Component Join Form */}
        <WatchlistForm />
      </main>
    </div>
  );
}
