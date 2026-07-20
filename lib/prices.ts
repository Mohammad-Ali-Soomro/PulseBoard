import { supabase } from "@/lib/supabase";
import {
  calculateRollingAverage,
  calculateRollingStdDev
} from "@/lib/priceAnalysis";

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  image?: string;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface AnomalyResult {
  coinId: string;
  name: string;
  symbol: string;
  isAnomalous: boolean;
  deviationScore: number;
  direction: "spike" | "drop" | "none";
  priceHistory: { date: string; price: number; isAnomaly: boolean; deviation: number }[];
  currentPrice: number;
}

const DEFAULT_COIN_IDS = "bitcoin,ethereum,solana,cardano,dogecoin";

export const COIN_LOGOS: Record<string, string> = {
  bitcoin: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  ethereum: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  solana: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  cardano: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  dogecoin: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
};

const CACHE_DURATION_MS = 10000; // 10 seconds

// In-memory cache keyed by coin lists
interface CacheEntry {
  data: CryptoPrice[];
  timestamp: number;
}
const priceCache = new Map<string, CacheEntry>();

// Cache for historical data by coin ID and days
interface HistoryCacheEntry {
  data: HistoricalDataPoint[];
  timestamp: number;
}
const historyCache = new Map<string, HistoryCacheEntry>();
const HISTORY_CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Fetches user custom tracked coins from Supabase. Falls back to default list.
 */
export async function getUserTrackedCoins(userEmail?: string): Promise<string> {
  if (!userEmail) return DEFAULT_COIN_IDS;
  try {
    const { data, error } = await supabase
      .from("user_coins")
      .select("coin_id")
      .eq("user_email", userEmail.trim().toLowerCase());

    if (!error && data && data.length > 0) {
      return data.map((item) => item.coin_id).join(",");
    }
  } catch (err) {
    console.error("Failed to load user tracked coins from Supabase:", err);
  }
  return DEFAULT_COIN_IDS;
}

/**
 * Fetches live market prices for specified coin IDs from CoinGecko markets endpoint.
 */
export async function fetchCryptoPrices(customCoinIds?: string): Promise<{
  data: CryptoPrice[];
  cached: boolean;
  timestamp: number;
}> {
  const coinIds = (customCoinIds ? customCoinIds.trim().toLowerCase() : DEFAULT_COIN_IDS);
  const currentTime = Date.now();

  // Return cached result if valid
  const cached = priceCache.get(coinIds);
  if (cached && (currentTime - cached.timestamp < CACHE_DURATION_MS)) {
    return {
      data: cached.data,
      cached: true,
      timestamp: cached.timestamp,
    };
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const headers: Record<string, string> = {
      "Accept": "application/json",
    };

    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    } else {
      console.warn(
        "Warning: COINGECKO_API_KEY is not defined. " +
        "Making unauthenticated request to CoinGecko public API (subject to rate limits)."
      );
    }

    const response = await fetch(url, {
      signal: controller.signal,
      headers,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CoinGecko returned HTTP status code ${response.status}`);
    }

    const rawData = await response.json();
    if (!Array.isArray(rawData)) {
      throw new Error("CoinGecko markets response was not an array");
    }

    const coinIdsArray = coinIds.split(",");

    // Transform raw markets data into target shape
    const formattedPrices: CryptoPrice[] = rawData.map((item: any) => {
      // Dynamic fallback register for logos cache
      if (item.image) {
        COIN_LOGOS[item.id] = item.image;
      }
      return {
        id: item.id,
        symbol: item.symbol.toUpperCase(),
        name: item.name,
        price: item.current_price ?? 0,
        change24h: item.price_change_percentage_24h ?? 0,
        marketCap: item.market_cap ?? 0,
        image: item.image,
      };
    });

    // Sort to match the requested IDs array order to preserve layout stability
    const sortedPrices = formattedPrices.sort(
      (a, b) => coinIdsArray.indexOf(a.id) - coinIdsArray.indexOf(b.id)
    );

    // Update Cache
    priceCache.set(coinIds, {
      data: sortedPrices,
      timestamp: currentTime,
    });

    return {
      data: sortedPrices,
      cached: false,
      timestamp: currentTime,
    };
  } catch (error) {
    console.error("Error in fetchCryptoPrices markets helper:", error);
    
    // Serve fallback from cache if available on failure
    if (cached) {
      return {
        data: cached.data,
        cached: true,
        timestamp: cached.timestamp,
      };
    }
    throw error;
  }
}

/**
 * Fetches price history data for a specific coin ID and days parameter with a 5-minute caching TTL.
 */
export async function fetchCryptoHistory(
  coinId: string,
  days: string
): Promise<HistoricalDataPoint[]> {
  const currentTime = Date.now();
  const cacheKey = `${coinId}_${days}`;
  const cached = historyCache.get(cacheKey);

  // Return cached result if valid
  if (cached && (currentTime - cached.timestamp < HISTORY_CACHE_DURATION_MS)) {
    return cached.data;
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const headers: Record<string, string> = {
      "Accept": "application/json",
    };

    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    } else {
      console.warn(
        `Warning: COINGECKO_API_KEY is not defined. ` +
        `Making unauthenticated price history request for ${coinId} to CoinGecko (subject to rate limits).`
      );
    }

    const response = await fetch(url, {
      signal: controller.signal,
      headers,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CoinGecko returned HTTP status code ${response.status}`);
    }

    const rawData = await response.json();

    if (!rawData.prices || !Array.isArray(rawData.prices)) {
      throw new Error("CoinGecko response was missing price history array");
    }

    // Map [timestamp_ms, price] into clean { date, price } shape
    const formattedData: HistoricalDataPoint[] = rawData.prices.map((point: [number, number]) => {
      const date = new Date(point[0]).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      return {
        date,
        price: point[1]
      };
    });

    // Save to cache
    historyCache.set(cacheKey, {
      data: formattedData,
      timestamp: currentTime
    });

    return formattedData;
  } catch (error) {
    console.error(`Historical fetch for ${coinId} failed:`, error);
    
    // If a stale cache exists, serve it as emergency fallback
    if (cached) {
      return cached.data;
    }
    throw error;
  }
}

/**
 * Analyzes price history to detect anomalies (crosses 2 standard deviations away from the rolling mean over a 7 day window).
 */
export async function detectAnomalies(customCoinIds?: string): Promise<AnomalyResult[]> {
  const coinIds = customCoinIds || DEFAULT_COIN_IDS;
  const coinIdsArray = coinIds.split(",");

  const coinNames: Record<string, { name: string; symbol: string }> = {
    bitcoin: { name: "Bitcoin", symbol: "BTC" },
    ethereum: { name: "Ethereum", symbol: "ETH" },
    solana: { name: "Solana", symbol: "SOL" },
    cardano: { name: "Cardano", symbol: "ADA" },
    dogecoin: { name: "Dogecoin", symbol: "DOGE" },
  };

  const results: AnomalyResult[] = [];

  for (const coinId of coinIdsArray) {
    try {
      const history = await fetchCryptoHistory(coinId, "30");
      if (history.length === 0) continue;

      const prices = history.map((h) => h.price);
      const rollingAverages = calculateRollingAverage(prices, 7);
      const rollingStdDevs = calculateRollingStdDev(prices, 7);

      const historyPoints = history.map((point, i) => {
        const avg = rollingAverages[i];
        const std = rollingStdDevs[i];
        const diff = point.price - avg;
        const deviation = std === 0 ? 0 : diff / std;
        const isAnomaly = Math.abs(deviation) >= 2;

        return {
          date: point.date,
          price: point.price,
          isAnomaly,
          deviation,
        };
      });

      const todayPoint = historyPoints[historyPoints.length - 1];
      const isAnomalous = todayPoint.isAnomaly;
      const deviationScore = Math.abs(todayPoint.deviation);
      const direction = isAnomalous
        ? (todayPoint.deviation >= 0 ? "spike" : "drop")
        : "none";

      let name = coinNames[coinId]?.name;
      let symbol = coinNames[coinId]?.symbol;

      if (!name || !symbol) {
        name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
        symbol = coinId.toUpperCase().slice(0, 4);
      }

      results.push({
        coinId,
        name,
        symbol,
        isAnomalous,
        deviationScore: Number(deviationScore.toFixed(2)),
        direction,
        priceHistory: historyPoints,
        currentPrice: todayPoint.price,
      });
    } catch (err) {
      console.error(`Error detecting anomalies for ${coinId}:`, err);
    }
  }

  return results;
}
