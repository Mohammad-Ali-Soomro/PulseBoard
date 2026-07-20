import { NextRequest, NextResponse } from "next/server";
import { fetchCryptoHistory } from "@/lib/prices";

const VALID_COINS = ["bitcoin", "ethereum", "solana", "cardano", "dogecoin"];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ coinId: string }> | { coinId: string } }
) {
  const params = await context.params;
  const coinId = params?.coinId?.toLowerCase();

  // Accept custom coins as well if they are requested, but validate basic shape
  if (!coinId) {
    return NextResponse.json(
      { error: "Missing coin ID" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days") || "7";
  const daysVal = parseInt(daysParam, 10);
  const days = !isNaN(daysVal) && daysVal >= 1 && daysVal <= 365 ? daysVal.toString() : "7";

  try {
    const data = await fetchCryptoHistory(coinId, days);
    return NextResponse.json({
      coinId,
      days,
      data,
      cached: true, // the helper handles caching internally, so the response is consistent
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`Historical API fetch for ${coinId} failed:`, error);
    return NextResponse.json(
      { error: `Failed to fetch price history for ${coinId} from CoinGecko` },
      { status: 500 }
    );
  }
}
