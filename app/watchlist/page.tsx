import Navbar from "@/components/Navbar";
import WatchlistForm from "@/components/WatchlistForm";
import { supabase } from "@/lib/supabase";
import { Award, Eye, Flame } from "lucide-react";

export const revalidate = 60; // Incremental Static Regeneration (ISR) - 60s TTL

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

    // Map and type the results
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

  // Compute maximum count for relative popularity bar calculations (minimum divisor is 1 to avoid NaN/Infinity)
  const maxWatchCount = Math.max(...sortedStats.map((item) => item.count), 1);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Reusable Navbar */}
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary/10 text-xs font-bold text-primary mb-4">
            <Flame className="w-3.5 h-3.5" />
            Global Sentiment Tracker
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Sentiment Leaderboard
          </h1>
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">
            See which assets are currently trending and being watched the most by the PulseBoard operator network.
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white border border-border rounded-card p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-card bg-primary/10 flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg text-text-primary">
                Most Watched Coins
              </h2>
              <p className="text-xs text-text-secondary">
                Aggregated sentiment rank updated every 60 seconds
              </p>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-6">
            {sortedStats.map((item, index) => {
              const rank = index + 1;
              const relativePercent = (item.count / maxWatchCount) * 100;

              return (
                <div key={item.id} className="flex items-center gap-4">
                  {/* Rank Number */}
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-sans font-bold text-sm text-text-primary shrink-0">
                    {rank}
                  </div>

                  {/* Coin Name and Info */}
                  <div className="w-28 sm:w-36 shrink-0">
                    <span className="font-sans font-bold text-sm sm:text-base text-text-primary block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                      {item.count} {item.count === 1 ? "watch" : "watches"}
                    </span>
                  </div>

                  {/* Visual Popularity Bar */}
                  <div className="flex-1 bg-surface h-5.5 rounded-full overflow-hidden border border-border/30 relative flex items-center px-1">
                    <div
                      className="bg-primary h-3.5 rounded-full transition-all duration-500 shadow-xs shadow-primary/10"
                      style={{ width: `${Math.max(relativePercent, 2)}%` }}
                    />
                  </div>

                  {/* Eye Icon indicator */}
                  <div className="hidden sm:flex items-center text-text-secondary/60 gap-1 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Separator line */}
        <hr className="border-border/60 my-12" />

        {/* Client Component Join Form */}
        <WatchlistForm />
      </main>
    </div>
  );
}
