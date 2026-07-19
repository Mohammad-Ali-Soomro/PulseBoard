import { NextRequest, NextResponse } from "next/server";
import { fetchCryptoPrices } from "@/lib/prices";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coinIds = searchParams.get("coinIds") || undefined;
    
    const result = await fetchCryptoPrices(coinIds);
    return NextResponse.json(result);
  } catch (error) {
    console.error("CoinGecko fetch in API route failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch live prices from CoinGecko public API" },
      { status: 500 }
    );
  }
}
