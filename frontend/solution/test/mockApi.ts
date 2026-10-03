import { vi } from "vitest";

// Test helper: replaces fetch with fake mock-API responses.

export const sampleAccounts = [
  { accountId: "P-9001", label: "Taxable Brokerage", totalMarketValue: 65680 },
  { accountId: "P-9002", label: "Retirement Account", totalMarketValue: 24465 },
];

export const samplePortfolio = {
  asOf: "2026-10-03T17:42:56.013Z",
  portfolio: {
    portfolioId: "P-9001",
    accountId: "P-9001",
    clientId: "abc123",
    label: "Taxable Brokerage",
    currency: "CAD",
    totalMarketValue: 65680,
    dayChangeAmount: 397.25,
    dayChangePercent: 0.61,
    totalReturnSinceInception: 0.187,
  },
  holdings: [],
  allocation: [],
  performanceHistory: [],
};

export const sampleExchangeRate = { CADtoUSD: 0.73 };

const unavailable = () =>
  Response.json({ message: "Service unavailable" }, { status: 503 });

export function stubMockApi({ failFirst = false, failRate = false } = {}) {
  let failed = false;

  const fetchMock = vi.fn(async (url: string) => {
    if (failFirst && !failed) {
      failed = true;
      return unavailable();
    }
    if (url.includes("/accounts")) return Response.json(sampleAccounts);
    if (url.includes("/portfolios/")) return Response.json(samplePortfolio);
    if (url.includes("/exchange-rate")) {
      return failRate ? unavailable() : Response.json(sampleExchangeRate);
    }
    return Response.json({ message: "Not found" }, { status: 404 });
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
