import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ data: [] });
    }

    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };

    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`CoinGecko search returned status ${response.status}`);
    }

    const rawData = await response.json();
    if (!rawData.coins || !Array.isArray(rawData.coins)) {
      return NextResponse.json({ data: [] });
    }

    // Limit to the top 10 results and map standard properties
    const formattedResults = rawData.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      thumb: coin.thumb || coin.large || "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    }));

    return NextResponse.json({ data: formattedResults });
  } catch (error) {
    console.error("CoinGecko search API route failed:", error);
    return NextResponse.json(
      { error: "Failed to query searchable coin list from CoinGecko" },
      { status: 500 }
    );
  }
}
