import { describe, expect, it } from "vitest";
import {
  formatFractionAsPercent,
  formatMoney,
  formatPercent,
  formatSignedMoney,
  getDirection,
} from "./format";

describe("getDirection", () => {
  it("treats gains as positive and losses as negative", () => {
    expect(getDirection(1520.44)).toBe("positive");
    expect(getDirection(-410.5)).toBe("negative");
  });

  it("treats zero as neutral, not positive", () => {
    expect(getDirection(0)).toBe("neutral");
    expect(getDirection(-0)).toBe("neutral");
  });
});

describe("formatMoney", () => {
  it("formats CAD with thousands separators and 2 decimals", () => {
    expect(formatMoney(482350.12)).toBe("$482,350.12");
    expect(formatMoney(65680)).toBe("$65,680.00");
  });

  it("keeps very large values readable", () => {
    expect(formatMoney(65680000000)).toBe("$65,680,000,000.00");
  });

  it("marks USD clearly so it can't be confused with CAD", () => {
    expect(formatMoney(1000, "USD")).toBe("US$1,000.00");
  });
});

describe("formatSignedMoney", () => {
  it("adds a + for gains and a - for losses", () => {
    expect(formatSignedMoney(1520.44)).toBe("+$1,520.44");
    expect(formatSignedMoney(-1340.41)).toBe("-$1,340.41");
  });

  it("shows zero without a sign", () => {
    expect(formatSignedMoney(0)).toBe("$0.00");
  });
});

describe("percent formats (the API uses two different units)", () => {
  it("formatPercent reads 0.32 as 0.32%", () => {
    expect(formatPercent(0.32)).toBe("+0.32%");
    expect(formatPercent(-2)).toBe("-2.00%");
    expect(formatPercent(0)).toBe("0.00%");
  });

  it("formatFractionAsPercent reads 0.187 as 18.7%", () => {
    expect(formatFractionAsPercent(0.187)).toBe("+18.7%");
    expect(formatFractionAsPercent(-0.087)).toBe("-8.7%");
    expect(formatFractionAsPercent(0)).toBe("0.0%");
  });
});
