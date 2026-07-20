import { NextRequest, NextResponse } from "next/server";
import { detectAnomalies, getUserTrackedCoins } from "@/lib/prices";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let coinIds = searchParams.get("coinIds") || undefined;

    if (!coinIds) {
      const cookieStore = await cookies();
      const userEmail = cookieStore.get("pulseboard_user_email")?.value;
      coinIds = await getUserTrackedCoins(userEmail);
    }

    const anomalies = await detectAnomalies(coinIds);

    // Map to exact requested properties: coinId, isAnomalous, deviationScore, direction
    const payload = anomalies.map((a) => ({
      coinId: a.coinId,
      isAnomalous: a.isAnomalous,
      deviationScore: a.deviationScore,
      direction: a.direction === "none" ? "none" : a.direction,
    }));

    return NextResponse.json({ data: payload });
  } catch (error) {
    console.error("Anomaly API route failed:", error);
    return NextResponse.json(
      { error: "Failed to run anomaly detection checks" },
      { status: 500 }
    );
  }
}
