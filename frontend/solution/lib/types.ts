// Shapes of the data returned by the mock API (see support/PORTFOLIO-API.md).
// All money values from the API are in CAD.

export type Currency = "CAD" | "USD";

export type DateRange = "1D" | "1M" | "YTD" | "1Y" | "All";

export type Account = {
  accountId: string;
  label: string;
  totalMarketValue: number;
};

export type PortfolioSummary = {
  portfolioId: string;
  accountId: string;
  clientId: string;
  label: string;
  currency: string;
  totalMarketValue: number;
  dayChangeAmount: number;
  /** 0.61 means 0.61% */
  dayChangePercent: number;
  /** 0.187 means 18.7% */
  totalReturnSinceInception: number;
};

export type Holding = {
  ticker: string;
  name: string;
  assetClass: string;
  sector: string;
  quantity: number;
  price: number;
  costBasisPerShare: number;
  marketValue: number;
  gainLoss: number;
  dayChangeAmount: number;
  /** 2.4 means 2.4% */
  dayChangePercent: number;
  /** 5.66 means 5.66% */
  weightPercent: number;
};

export type AllocationEntry = {
  assetClass: string;
  value: number;
};

export type PerformancePoint = {
  /** YYYY-MM-DD */
  date: string;
  marketValue: number;
};

export type PortfolioResponse = {
  asOf: string;
  portfolio: PortfolioSummary;
  holdings: Holding[];
  allocation: AllocationEntry[];
  performanceHistory: PerformancePoint[];
};

export type ExchangeRate = {
  CADtoUSD: number;
};
