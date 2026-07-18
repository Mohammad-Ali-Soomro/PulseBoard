import { NextResponse } from "next/server";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
}

const COIN_DETAILS: Record<string, { symbol: string; name: string }> = {
  bitcoin: { symbol: "BTC", name: "Bitcoin" },
  ethereum: { symbol: "ETH", name: "Ethereum" },
  solana: { symbol: "SOL", name: "Solana" },
  cardano: { symbol: "ADA", name: "Cardano" },
  dogecoin: { symbol: "DOGE", name: "Dogecoin" },
};

const COIN_IDS = Object.keys(COIN_DETAILS).join(",");
const CACHE_DURATION_MS = 10000; // 10 seconds cache

// Module-level in-memory cache
let cachedData: CryptoPrice[] | null = null;
let lastFetchedTimestamp = 0;

export async function GET() {
  const currentTime = Date.now();

  // Return cached data if still within TTL (10 seconds)
  if (cachedData && (currentTime - lastFetchedTimestamp < CACHE_DURATION_MS)) {
    return NextResponse.json({
      data: cachedData,
      cached: true,
      timestamp: lastFetchedTimestamp
    });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json"
      },
      cache: "no-store" // ensure we control the caching in-memory
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CoinGecko returned HTTP status code ${response.status}`);
    }

    const rawData = await response.json();

    // Transform raw CoinGecko response into clean target shape
    const formattedPrices: CryptoPrice[] = Object.keys(COIN_DETAILS).map((id) => {
      const stats = rawData[id] || {};
      return {
        id,
        symbol: COIN_DETAILS[id].symbol,
        name: COIN_DETAILS[id].name,
        price: stats.usd ?? 0,
        change24h: stats.usd_24h_change ?? 0,
        marketCap: stats.usd_market_cap ?? 0,
      };
    });

    // Update in-memory cache
    cachedData = formattedPrices;
    lastFetchedTimestamp = currentTime;

    return NextResponse.json({
      data: formattedPrices,
      cached: false,
      timestamp: currentTime
    });
  } catch (error) {
    console.error("CoinGecko fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch live prices from CoinGecko public API" },
      { status: 500 }
    );
  }
}
