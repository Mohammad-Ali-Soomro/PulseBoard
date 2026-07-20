import { detectAnomalies, COIN_LOGOS } from "@/lib/prices";
import Image from "next/image";
import AnomalySparkline from "./AnomalySparkline";
import { Sparkles } from "lucide-react";

export default async function UnusualActivity({ coinIds }: { coinIds?: string }) {
  const anomalies = await detectAnomalies(coinIds);
  const flaggedCoins = anomalies.filter((a) => a.isAnomalous);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#FFA946]" />
        <h2 className="font-serif font-semibold text-xl text-ink">
          Unusual Activity
        </h2>
      </div>

      {flaggedCoins.length === 0 ? (
        <div className="bg-background-deep border border-border-hairline-soft rounded-card p-6 text-center text-xs text-text-muted font-medium">
          No unusual activity right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flaggedCoins.map((coin) => {
            const isSpike = coin.direction === "spike";
            const borderClass = isSpike
              ? "border-l-4 border-l-[#FFA946] border-y border-r border-border-hairline-soft"
              : "border-l-4 border-l-[#E05252] border-y border-r border-border-hairline-soft";
            
            const directionText = isSpike ? "above" : "below";

            return (
              <div
                key={coin.coinId}
                className={`bg-background-deep rounded-card p-5 flex flex-col justify-between ${borderClass}`}
              >
                <div>
                  {/* Logo and Name */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <Image
                      src={COIN_LOGOS[coin.coinId] || "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"}
                      alt={`${coin.name} logo`}
                      width={22}
                      height={22}
                      className="rounded-full bg-background border border-border-hairline-soft shrink-0"
                    />
                    <span className="font-sans font-bold text-ink text-sm">
                      {coin.name}
                    </span>
                    <span className="font-sans font-bold text-[9px] text-text-muted uppercase tracking-wider bg-background border border-border-hairline-soft/60 px-1.5 py-0.5 rounded-sm">
                      {coin.symbol}
                    </span>
                  </div>

                  {/* Factual Description */}
                  <p className="text-xs text-text-muted leading-relaxed font-sans pr-2">
                    {coin.name} is trading {coin.deviationScore} standard deviations {directionText} its 7 day average.
                  </p>
                </div>

                {/* Sparkline Visualisation */}
                <div className="mt-4 pt-3 border-t border-border-hairline-soft/45">
                  <div className="flex justify-between items-center mb-1.5 text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    <span>30d Trend</span>
                    <span className={isSpike ? "text-[#FFA946]" : "text-[#E05252]"}>
                      {isSpike ? "Spike" : "Drop"} Flagged
                    </span>
                  </div>
                  <AnomalySparkline data={coin.priceHistory} direction={coin.direction} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
