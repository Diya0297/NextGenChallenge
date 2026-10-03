"use client";

import { useDashboard } from "@/components/providers/DashboardProvider";
import StatusMessage from "@/components/ui/StatusMessage";
import SummaryCard from "./SummaryCard";

// Connects the summary card to the selected account's data.
export default function PortfolioSummary() {
  const { portfolio, currency } = useDashboard();

  if (portfolio.status !== "success") {
    return <StatusMessage state={portfolio} />;
  }

  return <SummaryCard summary={portfolio.data.portfolio} currency={currency} />;
}
