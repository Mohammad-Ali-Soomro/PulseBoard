import { NextResponse } from "next/server";
import { fetchCryptoPrices } from "@/lib/prices";

export async function GET() {
  try {
    const result = await fetchCryptoPrices();
    return NextResponse.json(result);
  } catch (error) {
    console.error("CoinGecko fetch in API route failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch live prices from CoinGecko public API" },
      { status: 500 }
    );
  }
}
