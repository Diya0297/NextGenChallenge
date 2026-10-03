"use client";

import { useDashboard } from "@/components/providers/DashboardProvider";
import type { Currency } from "@/lib/types";
import styles from "./CurrencyToggle.module.css";

const OPTIONS: Currency[] = ["CAD", "USD"];

// Task 7: switches every dollar figure on the dashboard between CAD and USD.
export default function CurrencyToggle() {
  const { currency, setCurrency, exchangeRate } = useDashboard();
  const rateReady = exchangeRate.status === "success";

  const hint =
    exchangeRate.status === "success"
      ? `1 CAD = ${exchangeRate.data.CADtoUSD} USD`
      : exchangeRate.status === "error"
        ? "Exchange rate unavailable: showing CAD"
        : "Loading exchange rate…";

  return (
    <div
      role="group"
      aria-label="Display currency"
      title={hint}
      className={styles.toggle}
    >
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={currency === option}
          // USD needs the exchange rate; CAD is always available.
          disabled={option === "USD" && !rateReady}
          onClick={() => setCurrency(option)}
          className={styles.option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
