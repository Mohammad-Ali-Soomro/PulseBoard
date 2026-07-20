/**
 * Calculates simple rolling average (moving average) over a specified window.
 * If the index is smaller than the windowSize - 1, it computes the average of
 * all elements available up to that index (partial window).
 * 
 * @param prices Array of numeric price values
 * @param windowSize The rolling window size
 * @returns Array of rolling averages matching the input array length
 */
export function calculateRollingAverage(prices: number[], windowSize: number): number[] {
  if (prices.length === 0) return [];
  if (windowSize <= 0) return [...prices];

  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const windowElements = prices.slice(start, i + 1);
    const sum = windowElements.reduce((acc, val) => acc + val, 0);
    result.push(sum / windowElements.length);
  }
  return result;
}

/**
 * Calculates the rolling population standard deviation over a specified window.
 * If the index is smaller than the windowSize - 1, it computes standard deviation
 * using all elements available up to that index.
 * 
 * @param prices Array of numeric price values
 * @param windowSize The rolling window size
 * @returns Array of rolling standard deviations matching the input array length
 */
export function calculateRollingStdDev(prices: number[], windowSize: number): number[] {
  if (prices.length === 0) return [];
  if (windowSize <= 0) return new Array(prices.length).fill(0);

  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const windowElements = prices.slice(start, i + 1);
    const n = windowElements.length;
    
    if (n <= 1) {
      result.push(0);
      continue;
    }
    
    const mean = windowElements.reduce((acc, val) => acc + val, 0) / n;
    const squaredDiffsSum = windowElements.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const variance = squaredDiffsSum / n; // population variance
    result.push(Math.sqrt(variance));
  }
  return result;
}

/**
 * Calculates percent change between two prices.
 * Returns 0 if the startPrice is 0 to avoid division by zero.
 * 
 * @param startPrice Initial price
 * @param endPrice Ending price
 * @returns Percentage change as a number (e.g. 15.5 for 15.5% increase)
 */
export function calculatePercentChange(startPrice: number, endPrice: number): number {
  if (startPrice === 0) return 0;
  return ((endPrice - startPrice) / startPrice) * 100;
}

/**
 * Calculates the maximum drawdown (peak-to-trough decline) as a positive percentage.
 * If prices array has less than 2 elements, returns 0.
 * 
 * @param prices Array of numeric price values
 * @returns Maximum drawdown as a percentage (e.g., 25.0 for a peak-to-trough decline of 25%)
 */
export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length < 2) return 0;

  let maxPeak = prices[0];
  let maxDrawdownPercent = 0;

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];
    if (currentPrice > maxPeak) {
      maxPeak = currentPrice;
    } else {
      const drawdownPercent = ((maxPeak - currentPrice) / maxPeak) * 100;
      if (drawdownPercent > maxDrawdownPercent) {
        maxDrawdownPercent = drawdownPercent;
      }
    }
  }

  return maxDrawdownPercent;
}
