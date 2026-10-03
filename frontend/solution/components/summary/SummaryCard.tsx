import {
  formatFractionAsPercent,
  formatMoney,
  formatPercent,
  formatSignedMoney,
  getDirection,
  type Direction,
} from "@/lib/format";
import type { Currency, PortfolioSummary } from "@/lib/types";
import styles from "./SummaryCard.module.css";

type SummaryCardProps = {
  summary: Pick<
    PortfolioSummary,
    | "totalMarketValue"
    | "dayChangeAmount"
    | "dayChangePercent"
    | "totalReturnSinceInception"
  >;
  currency: Currency;
};

// Task 2: shows the portfolio's total value, day change and total return.
export default function SummaryCard({ summary, currency }: SummaryCardProps) {
  const dayDirection = getDirection(summary.dayChangeAmount);
  const returnDirection = getDirection(summary.totalReturnSinceInception);

  return (
    <div className={styles.summary}>
      <div>
        <p className={styles.total}>
          {formatMoney(summary.totalMarketValue, currency)}
        </p>
        <p className={styles.label}>Total Market Value</p>
      </div>

      <div>
        <p
          className={`${styles.change} ${styles[dayDirection]}`}
          data-testid="day-change"
          data-direction={dayDirection}
        >
          {formatSignedMoney(summary.dayChangeAmount, currency)} (
          {formatPercent(summary.dayChangePercent)})
          <TrendIcon direction={dayDirection} />
        </p>
        <p className={styles.label}>Day Change</p>
      </div>

      <div>
        <p
          className={`${styles.change} ${styles[returnDirection]}`}
          data-testid="total-return"
          data-direction={returnDirection}
        >
          {formatFractionAsPercent(summary.totalReturnSinceInception)}
        </p>
        <p className={styles.label}>Total Return Since Inception</p>
      </div>
    </div>
  );
}

// Arrow up, arrow down, or a flat line. The +/- sign carries the meaning too,
// so colour is never the only signal.
function TrendIcon({ direction }: { direction: Direction }) {
  const paths: Record<Direction, string> = {
    positive: "M3 17l6-6 4 4 8-8M14 7h7v7",
    negative: "M3 7l6 6 4-4 8 8M14 17h7v-7",
    neutral: "M4 12h16",
  };

  return (
    <span className={styles.icon} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={paths[direction]} />
      </svg>
    </span>
  );
}
