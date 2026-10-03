"use client";

import styles from "./DateRangeSelector.module.css";
import { type DateRangeOption, DATE_RANGE_OPTIONS } from "./chartUtils";

export interface DateRangeSelectorProps {
  selectedRange: DateRangeOption;
  onRangeChange: (range: DateRangeOption) => void;
  className?: string;
}

export default function DateRangeSelector({
  selectedRange,
  onRangeChange,
  className = "",
}: DateRangeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Date range selector"
      className={`${styles.selector} ${className}`}
    >
      {DATE_RANGE_OPTIONS.map((option) => {
        const isActive = selectedRange === option;
        return (
          <button
            key={option}
            type="button"
            className={`${styles.pill} ${isActive ? styles.active : ""}`}
            onClick={() => onRangeChange(option)}
            aria-pressed={isActive}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
