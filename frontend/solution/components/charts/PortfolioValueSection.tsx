"use client";

import { useEffect, useState, useMemo } from "react";
import PortfolioValueChart from "./PortfolioValueChart";
import DateRangeSelector from "./DateRangeSelector";
import { useAccount } from "@/context/AccountContext";
import {
  type TimeSeriesPoint,
  type DateRangeOption,
  filterTimeSeriesByRange,
} from "./chartUtils";

// Default sample data fallback if API is unreachable
const FALLBACK_DATA: TimeSeriesPoint[] = [
  { date: "2025-01-01", marketValue: 410000.0 },
  { date: "2025-02-01", marketValue: 423500.0 },
  { date: "2025-03-01", marketValue: 418200.0 },
  { date: "2025-04-01", marketValue: 435000.0 },
  { date: "2025-05-01", marketValue: 442100.0 },
  { date: "2025-06-01", marketValue: 450200.0 },
  { date: "2025-07-01", marketValue: 462800.0 },
  { date: "2025-08-01", marketValue: 458900.0 },
  { date: "2025-09-01", marketValue: 472000.0 },
  { date: "2025-10-01", marketValue: 482350.0 },
];

export interface PortfolioValueSectionProps {
  initialData?: TimeSeriesPoint[];
  accountId?: string;
  currency?: "CAD" | "USD";
}

export default function PortfolioValueSection({
  initialData,
  accountId: propAccountId,
  currency = "CAD",
}: PortfolioValueSectionProps) {
  const { selectedAccountId } = useAccount();
  const accountId = propAccountId ?? selectedAccountId;

  const [fetchedData, setFetchedData] = useState<TimeSeriesPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("All");

  const data = useMemo(
    () => initialData ?? fetchedData ?? [],
    [initialData, fetchedData]
  );
  const filteredData = useMemo(
    () => filterTimeSeriesByRange(data, selectedRange),
    [data, selectedRange]
  );

  useEffect(() => {
    if (initialData) return;

    const abortController = new AbortController();

    async function loadPortfolioHistory() {
      setIsLoading(true);
      try {
        // Read scenario from current URL if available
        let scenarioParam = "";
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const scenario = params.get("scenario");
          if (scenario) {
            scenarioParam = `?scenario=${encodeURIComponent(scenario)}`;
          }
        }

        const res = await fetch(
          `http://localhost:4000/portfolios/${accountId}${scenarioParam}`,
          { signal: abortController.signal }
        );

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const json = await res.json();
        if (Array.isArray(json.performanceHistory)) {
          setFetchedData(json.performanceHistory);
        } else {
          setFetchedData(FALLBACK_DATA);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          // Fall back gracefully to mock sample data
          setFetchedData(FALLBACK_DATA);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPortfolioHistory();

    return () => {
      abortController.abort();
    };
  }, [initialData, accountId]);

  if (isLoading && data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 240,
          color: "var(--muted)",
          fontSize: "0.9rem",
        }}
      >
        Loading chart data...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <DateRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>
      <PortfolioValueChart data={filteredData} currency={currency} />
    </div>
  );
}
