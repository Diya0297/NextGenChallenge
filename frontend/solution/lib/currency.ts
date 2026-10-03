import { formatMoney, formatSignedMoney } from "./format";
import type { Currency } from "./types";

// All API money values are in CAD. Convert the raw value first and round only when
// formatting, so totals never disagree because of rounding at different steps.
export function convertFromCad(
  amountCad: number,
  currency: Currency,
  cadToUsd: number,
): number {
  return currency === "USD" ? amountCad * cadToUsd : amountCad;
}

export type Money = {
  currency: Currency;
  /** CAD amount → number in the display currency (use for chart values) */
  convert: (amountCad: number) => number;
  /** CAD amount → "$65,680.00" or "US$47,946.40" */
  format: (amountCad: number) => string;
  /** CAD amount → "+$397.25" or "+US$289.99" */
  formatSigned: (amountCad: number) => string;
};

export function createMoney(currency: Currency, cadToUsd: number): Money {
  const convert = (amountCad: number) =>
    convertFromCad(amountCad, currency, cadToUsd);

  return {
    currency,
    convert,
    format: (amountCad) => formatMoney(convert(amountCad), currency),
    formatSigned: (amountCad) => formatSignedMoney(convert(amountCad), currency),
  };
}
