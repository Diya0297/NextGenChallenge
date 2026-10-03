"use client";

import { useEffect, useState } from "react";
import AssetAllocationChart from "./AssetAllocationChart";
import { useAccount } from "@/context/AccountContext";
import { type AllocationEntry } from "./chartUtils";

const FALLBACK_ALLOCATION: AllocationEntry[] = [
  { assetClass: "Equity", "value": 289410.0 },
  { assetClass: "Fixed Income", "value": 120500.0 },
  { assetClass: "Cash", "value": 42340.12 },
  { assetClass: "Alternatives", "value": 30100.0 },
];

export interface AssetAllocationSectionProps {
  initialData?: AllocationEntry[];
  accountId?: string;
  currency?: "CAD" | "USD";
}

export default function AssetAllocationSection({
  initialData,
  accountId: propAccountId,
  currency = "CAD",
}: AssetAllocationSectionProps) {
  const { selectedAccountId } = useAccount();
  const accountId = propAccountId ?? selectedAccountId;

  const [fetchedData, setFetchedData] = useState<AllocationEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);

  const data = initialData ?? fetchedData ?? [];

  useEffect(() => {
    if (initialData) return;

    const abortController = new AbortController();

    async function loadAllocation() {
      setIsLoading(true);
      try {
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
        if (Array.isArray(json.allocation)) {
          setFetchedData(json.allocation);
        } else {
          setFetchedData(FALLBACK_ALLOCATION);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          setFetchedData(FALLBACK_ALLOCATION);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAllocation();

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
        Loading allocation...
      </div>
    );
  }

  return <AssetAllocationChart data={data} currency={currency} />;
}
