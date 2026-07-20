import { NextRequest, NextResponse } from "next/server";
import { fetchCryptoHistory } from "@/lib/prices";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coinId, timeframe, strategyType, strategyParams } = body;

    if (!coinId || !timeframe || !strategyType) {
      return NextResponse.json(
        { error: "Missing required parameters: coinId, timeframe, strategyType" },
        { status: 400 }
      );
    }

    const days = parseInt(timeframe, 10);
    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Timeframe must be an integer between 1 and 365" },
        { status: 400 }
      );
    }

    // Fetch history using cached helper
    const history = await fetchCryptoHistory(coinId.toLowerCase(), days.toString());
    if (history.length === 0) {
      return NextResponse.json(
        { error: "No historical price data found for selected coin" },
        { status: 400 }
      );
    }

    const prices = history.map((h) => h.price);
    const startPrice = prices[0];
    const n = prices.length;

    // Simulation states
    let totalInvested = 0;
    let coinsAccumulated = 0;
    const strategyValues: number[] = [];

    if (strategyType === "buy_and_hold") {
      // Baseline: invest $1000 at the start
      const principal = 1000;
      totalInvested = principal;
      coinsAccumulated = principal / startPrice;

      for (let t = 0; t < n; t++) {
        strategyValues.push(coinsAccumulated * prices[t]);
      }
    } else if (strategyType === "dca") {
      // Dollar cost averaging: invest a fixed $100 every N days
      const dcaIntervalDays = parseInt(strategyParams?.dcaIntervalDays, 10) || 7;
      const purchaseAmount = 100;

      for (let t = 0; t < n; t++) {
        // Buy on day 0, day N, day 2N, etc.
        if (t === 0 || t % dcaIntervalDays === 0) {
          totalInvested += purchaseAmount;
          coinsAccumulated += purchaseAmount / prices[t];
        }
        strategyValues.push(coinsAccumulated * prices[t]);
      }
    } else if (strategyType === "dip_buyer") {
      // Dip buyer: invest $100 on day 0, and $100 every time price drops X% from previous local high
      const dipPercentage = parseFloat(strategyParams?.dipPercentage) || 5.0;
      const purchaseAmount = 100;

      let localHigh = startPrice;
      
      // Initial position on day 0
      totalInvested += purchaseAmount;
      coinsAccumulated += purchaseAmount / startPrice;
      strategyValues.push(coinsAccumulated * startPrice);

      for (let t = 1; t < n; t++) {
        const currentPrice = prices[t];

        if (currentPrice > localHigh) {
          localHigh = currentPrice;
        }

        const drop = ((localHigh - currentPrice) / localHigh) * 100;
        if (drop >= dipPercentage) {
          // Trigger buy
          totalInvested += purchaseAmount;
          coinsAccumulated += purchaseAmount / currentPrice;
          
          // Reset local high to this purchase price
          localHigh = currentPrice;
        }

        strategyValues.push(coinsAccumulated * currentPrice);
      }
    } else {
      return NextResponse.json(
        { error: `Unsupported strategy type: ${strategyType}` },
        { status: 400 }
      );
    }

    // Now compute Buy and Hold values for the SAME total invested amount
    const bahCoins = totalInvested / startPrice;
    const chartData = history.map((point, t) => ({
      date: point.date,
      strategyValue: Number(strategyValues[t].toFixed(2)),
      buyAndHoldValue: Number((bahCoins * point.price).toFixed(2)),
      price: point.price,
    }));

    const finalStrategyValue = strategyValues[n - 1];
    const finalBahValue = bahCoins * prices[n - 1];

    const strategyReturn = totalInvested === 0 ? 0 : ((finalStrategyValue - totalInvested) / totalInvested) * 100;
    const bahReturn = totalInvested === 0 ? 0 : ((finalBahValue - totalInvested) / totalInvested) * 100;

    return NextResponse.json({
      coinId,
      timeframe: days,
      strategyType,
      totalInvested: Number(totalInvested.toFixed(2)),
      finalValue: Number(finalStrategyValue.toFixed(2)),
      percentageReturn: Number(strategyReturn.toFixed(2)),
      buyAndHoldReturn: Number(bahReturn.toFixed(2)),
      chartData,
    });
  } catch (error) {
    console.error("Backtest API execution failed:", error);
    return NextResponse.json(
      { error: "Internal server error during backtesting simulation" },
      { status: 500 }
    );
  }
}
