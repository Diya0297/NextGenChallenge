"use client";

import { useDashboard } from "@/components/providers/DashboardProvider";
import StatusMessage from "@/components/ui/StatusMessage";
import SummaryCard from "./SummaryCard";

// Connects the summary card to the selected account's data,
// converted into the selected currency. Percentages are not converted.
export default function PortfolioSummary() {
  const { portfolio, money } = useDashboard();

  if (portfolio.status !== "success") {
    return <StatusMessage state={portfolio} />;
  }

  const summary = portfolio.data.portfolio;

  return (
    <SummaryCard
      summary={{
        ...summary,
        totalMarketValue: money.convert(summary.totalMarketValue),
        dayChangeAmount: money.convert(summary.dayChangeAmount),
      }}
      currency={money.currency}
    />
  );
}
