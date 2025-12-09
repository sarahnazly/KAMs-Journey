/**
 * Value normalization utilities for ML predictions
 * 
 * Handles edge cases from backend:  
 * - Predictions > 1.0 (e.g., 1.475 = 147.5%)
 * - Negative predictions (e.g., -0.1 = -10%)
 * - Null/undefined values
 * - Formatting for display
 */
export function normalizeToPercentage(
  value: number | null | undefined,
  options: {
    cap?: boolean;      // Cap at 100%?  (default: false)
    floor?: boolean;    // Floor at 0%? (default: false)
    decimals?: number;  // Round to N decimals (default: 1)
  } = {}
): number {
  const {
    cap = false,
    floor = false,
    decimals = 2,
  } = options;

  if (value == null) return 0;

  let percentage = value * 100;

  if (floor && percentage < 0) {
    percentage = 0;
  }

  if (cap && percentage > 100) {
    percentage = 100;
  }

  return parseFloat(percentage.toFixed(decimals));
}