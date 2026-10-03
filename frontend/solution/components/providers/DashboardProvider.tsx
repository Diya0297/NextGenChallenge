"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { apiUrl, pickMockOptions } from "@/lib/api";
import { createMoney, type Money } from "@/lib/currency";
import { useApi, type ApiState } from "@/lib/useApi";
import type {
  Account,
  Currency,
  DateRange,
  ExchangeRate,
  PortfolioResponse,
} from "@/lib/types";

// Shared dashboard state. Any component can read it with useDashboard().
type DashboardState = {
  accounts: ApiState<Account[]>;
  accountId: string | null;
  setAccountId: (accountId: string) => void;
  portfolio: ApiState<PortfolioResponse>;
  /** The currency figures are shown in. Stays CAD until the exchange rate has loaded. */
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: ApiState<ExchangeRate>;
  /** Convert and format every CAD amount through this, so the currency toggle works everywhere */
  money: Money;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  /** Mock API options from the page URL; add to your own apiUrl() calls */
  mockOptions: string;
};

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const mockOptions = pickMockOptions(useSearchParams());

  const accounts = useApi<Account[]>(apiUrl("/accounts", mockOptions));
  const [chosenAccountId, setAccountId] = useState<string | null>(null);
  // Until the user picks an account, show the first one.
  const accountId =
    chosenAccountId ??
    (accounts.status === "success" ? (accounts.data[0]?.accountId ?? null) : null);

  const portfolioState = useApi<PortfolioResponse>(
    accountId
      ? apiUrl(`/portfolios/${encodeURIComponent(accountId)}`, mockOptions)
      : null,
  );
  // If the accounts list failed, the portfolio can't load either, so show that error.
  const portfolio = accounts.status === "error" ? accounts : portfolioState;

  // Loaded once; switching currency never refetches data.
  const exchangeRate = useApi<ExchangeRate>(apiUrl("/exchange-rate", mockOptions));
  const [chosenCurrency, setCurrency] = useState<Currency>("CAD");
  const currency = exchangeRate.status === "success" ? chosenCurrency : "CAD";
  const money = createMoney(
    currency,
    exchangeRate.status === "success" ? exchangeRate.data.CADtoUSD : 1,
  );

  const [dateRange, setDateRange] = useState<DateRange>("1Y");

  return (
    <DashboardContext.Provider
      value={{
        accounts,
        accountId,
        setAccountId,
        portfolio,
        currency,
        setCurrency,
        exchangeRate,
        money,
        dateRange,
        setDateRange,
        mockOptions,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardState {
  const state = useContext(DashboardContext);
  if (!state) {
    throw new Error("useDashboard must be used inside <DashboardProvider>");
  }
  return state;
}
