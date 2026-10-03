import type { Currency } from "./types";

// Use these helpers for every number shown on the dashboard,
// so formatting (and later currency conversion) is the same everywhere.

export type Direction = "positive" | "negative" | "neutral";

export function getDirection(value: number): Direction {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

/** 65680 → "$65,680.00" (CAD) or "US$65,680.00" (USD) */
export function formatMoney(amount: number, currency: Currency = "CAD"): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Like formatMoney, but with a + or - sign: "+$397.25", "-$1,340.41", "$0.00" */
export function formatSignedMoney(
  amount: number,
  currency: Currency = "CAD",
): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    signDisplay: "exceptZero",
  }).format(amount);
}

/** For fields where 2.4 means 2.4% (dayChangePercent, weightPercent): 0.61 → "+0.61%" */
export function formatPercent(percent: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(percent / 100);
}

/** For fields where 0.187 means 18.7% (totalReturnSinceInception): 0.187 → "+18.7%" */
export function formatFractionAsPercent(fraction: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(fraction);
}
