import { describe, expect, it } from "vitest";
import { convertFromCad, createMoney } from "./currency";

describe("convertFromCad", () => {
  it("leaves CAD amounts unchanged", () => {
    expect(convertFromCad(65680, "CAD", 0.73)).toBe(65680);
  });

  it("multiplies by the rate for USD", () => {
    expect(convertFromCad(100, "USD", 0.73)).toBeCloseTo(73);
  });
});

describe("createMoney", () => {
  it("formats CAD amounts in CAD", () => {
    const money = createMoney("CAD", 0.73);
    expect(money.format(65680)).toBe("$65,680.00");
    expect(money.formatSigned(397.25)).toBe("+$397.25");
  });

  it("converts and labels USD amounts", () => {
    const money = createMoney("USD", 0.73);
    expect(money.format(65680)).toBe("US$47,946.40");
    expect(money.formatSigned(-1340.41)).toBe("-US$978.50");
  });

  it("rounds only at the end, so converted parts add up to the converted total", () => {
    const money = createMoney("USD", 0.73);
    const holdings = [27300, 21630, 16750];
    const total = holdings.reduce((sum, value) => sum + value, 0);

    const sumOfConverted = holdings
      .map(money.convert)
      .reduce((sum, value) => sum + value, 0);

    expect(sumOfConverted).toBeCloseTo(money.convert(total), 10);
  });
});
