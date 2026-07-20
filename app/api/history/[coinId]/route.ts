import { NextRequest, NextResponse } from "next/server";

interface HistoricalDataPoint {
  date: string;
  price: number;
}

// In-memory cache for historical data by coin ID
interface CacheEntry {
  data: HistoricalDataPoint[];
  timestamp: number;
}

const historyCache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache TTL

const VALID_COINS = ["bitcoin", "ethereum", "solana", "cardano", "dogecoin"];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ coinId: string }> | { coinId: string } }
) {
  // Await params to support Next.js 15/16 dynamic route specifications
  const params = await context.params;
  const coinId = params?.coinId?.toLowerCase();

  if (!coinId || !VALID_COINS.includes(coinId)) {
    return NextResponse.json(
      { error: `Invalid coin ID. Supported: ${VALID_COINS.join(", ")}` },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days") || "7";
  const daysVal = parseInt(daysParam, 10);
  const days = !isNaN(daysVal) && daysVal >= 1 && daysVal <= 365 ? daysVal.toString() : "7";

  const currentTime = Date.now();
  const cacheKey = `${coinId}_${days}`;
  const cached = historyCache.get(cacheKey);

  // Return cached result if valid
  if (cached && (currentTime - cached.timestamp < CACHE_DURATION_MS)) {
    return NextResponse.json({
      coinId,
      days,
      data: cached.data,
      cached: true,
      timestamp: cached.timestamp
    });
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

    return NextResponse.json({
      coinId,
      days,
      data: formattedData,
      cached: false,
      timestamp: currentTime
    });
  } catch (error) {
    console.error(`Historical fetch for ${coinId} failed:`, error);
    
    // If a stale cache exists, serve it as emergency fallback
    if (cached) {
      return NextResponse.json({
        coinId,
        days,
        data: cached.data,
        cached: true,
        fallback: true,
        timestamp: cached.timestamp
      });
    }

    return NextResponse.json(
      { error: `Failed to fetch price history for ${coinId} from CoinGecko` },
      { status: 500 }
    );
  }
}
