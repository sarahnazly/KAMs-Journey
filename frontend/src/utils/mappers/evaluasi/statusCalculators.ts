import { KPIStatus, QuadrantStatus } from "@/interfaces/evaluasi/types";

// Calculate the delta (difference) between predicted and current values
export function calcDelta(current: number, predicted: number): number {
  return predicted - current;
}

// Calculate the delta as a percentage change
export function calcDeltaPercent(current: number, predicted: number): string {
  if (current === 0) {
    return predicted > 0 ? "+∞%" : "0%";
  }
  
  const percentChange = ((predicted - current) / current) * 100;
  const sign = percentChange >= 0 ? "+" : "";
  
  return `${sign}${percentChange.toFixed(1)}%`;
}

// Determine Quadrant status based on current and predicted quadrants
export function calcQuadrantStatus(
  currentQuadrant:  number,
  predictedQuadrant: number
): QuadrantStatus {
  if (predictedQuadrant < currentQuadrant) {
    return "Improving";  // Moving to better quadrant
  }
  
  if (predictedQuadrant > currentQuadrant) {
    return "Declining";  // Moving to worse quadrant
  }
  
  return "Stable";  // Staying in same quadrant
}