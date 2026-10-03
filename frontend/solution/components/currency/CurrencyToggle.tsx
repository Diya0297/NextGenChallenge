"use client";

import { useDashboard } from "@/components/providers/DashboardProvider";
import type { Currency } from "@/lib/types";
import styles from "./CurrencyToggle.module.css";

const OPTIONS: Currency[] = ["CAD", "USD"];

// Task 7: switches every dollar figure on the dashboard between CAD and USD,
// and shows the exchange rate being used.
export default function CurrencyToggle() {
  const { currency, setCurrency, exchangeRate } = useDashboard();
  const rateReady = exchangeRate.status === "success";

  const rateText =
    exchangeRate.status === "success"
      ? `1 CAD = ${exchangeRate.data.CADtoUSD} USD`
      : exchangeRate.status === "error"
        ? "Rate unavailable"
        : "Loading rate…";

  return (
    <div className={styles.wrapper}>
      <p className={styles.rate} data-testid="exchange-rate">
        {rateText}
      </p>

      <div role="group" aria-label="Display currency" className={styles.toggle}>
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
    </div>
  );
}
