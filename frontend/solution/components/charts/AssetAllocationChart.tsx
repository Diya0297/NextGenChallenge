"use client";

import { useState, useMemo } from "react";
import styles from "./AssetAllocationChart.module.css";
import {
  type AllocationEntry,
  buildDonutSlices,
  formatCurrency,
} from "./chartUtils";

export interface AssetAllocationChartProps {
  data?: AllocationEntry[];
  currency?: "CAD" | "USD";
  className?: string;
}

const CX = 100;
const CY = 100;
const OUTER_R = 85;
const INNER_R = 56;

export default function AssetAllocationChart({
  data = [],
  currency = "CAD",
  className = "",
}: AssetAllocationChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const slices = useMemo(
    () => buildDonutSlices(data, CX, CY, OUTER_R, INNER_R),
    [data]
  );

  const totalValue = useMemo(() => {
    if (!data) return 0;
    return data.reduce((acc, curr) => acc + (curr.value > 0 ? curr.value : 0), 0);
  }, [data]);

  if (!data || data.length === 0 || totalValue === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.emptyState}>
          <p>No asset allocation data available</p>
        </div>
      </div>
    );
  }

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Donut Chart SVG */}
      <div className={styles.donutWrapper}>
        <svg
          viewBox="0 0 200 200"
          className={styles.svg}
          role="img"
          aria-label="Asset allocation donut chart"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {slices.map((slice, idx) => {
            const isHovered = hoveredIndex === idx;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <path
                key={slice.assetClass}
                d={slice.path}
                fill={slice.color}
                className={`${styles.slice} ${isHovered ? styles.sliceActive : isDimmed ? styles.sliceDimmed : ""
                  }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                aria-label={`${slice.assetClass}: ${slice.percent}%`}
              />
            );
          })}
        </svg>

        {/* Center Cutout Text */}
        <div className={styles.centerLabel}>
          <span className={styles.centerTitle}>
            {activeSlice ? activeSlice.assetClass : "Total"}
          </span>
          <span className={styles.centerValue}>
            {activeSlice
              ? `${activeSlice.percent.toFixed(1)}%`
              : formatCurrency(totalValue, currency)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {slices.map((slice, idx) => {
          const isHovered = hoveredIndex === idx;
          const isDimmed = hoveredIndex !== null && !isHovered;

          return (
            <div
              key={slice.assetClass}
              className={`${styles.legendItem} ${isHovered
                  ? styles.legendItemActive
                  : isDimmed
                    ? styles.legendItemDimmed
                    : ""
                }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={styles.legendLeft}>
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: slice.color }}
                />
                <span className={styles.legendName}>{slice.assetClass}</span>
              </div>
              <div className={styles.legendRight}>
                <span className={styles.legendPercent}>
                  {slice.percent.toFixed(1)}%
                </span>
                <span className={styles.legendValue}>
                  {formatCurrency(slice.value, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
