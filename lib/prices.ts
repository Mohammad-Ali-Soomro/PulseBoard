export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  image?: string;
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
