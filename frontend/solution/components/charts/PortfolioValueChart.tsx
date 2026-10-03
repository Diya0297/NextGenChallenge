"use client";

import { useState, useId, useMemo, useRef } from "react";
import styles from "./PortfolioValueChart.module.css";
import {
  type TimeSeriesPoint,
  computeYBounds,
  projectPoints,
  buildLinePath,
  buildAreaPath,
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  type ScaledPoint,
} from "./chartUtils";

export interface PortfolioValueChartProps {
  data?: TimeSeriesPoint[];
  currency?: "CAD" | "USD";
  className?: string;
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 240;
const CHART_PADDING = { top: 20, right: 20, bottom: 35, left: 60 };

export default function PortfolioValueChart({
  data = [],
  currency = "CAD",
  className = "",
}: PortfolioValueChartProps) {
  const gradientId = useId();
  const [hoveredPoint, setHoveredPoint] = useState<ScaledPoint | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const width = CHART_WIDTH;
  const height = CHART_HEIGHT;
  const padding = CHART_PADDING;

  const bounds = useMemo(() => computeYBounds(data), [data]);

  const scaledPoints = useMemo(
    () => projectPoints(data, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING, bounds),
    [data, bounds]
  );

  const linePath = useMemo(() => buildLinePath(scaledPoints), [scaledPoints]);
  const areaPath = useMemo(
    () => buildAreaPath(scaledPoints, CHART_HEIGHT - CHART_PADDING.bottom),
    [scaledPoints]
  );

  // Y-axis tick values (4 steps)
  const yTicks = useMemo(() => {
    const { minY, maxY } = bounds;
    const step = (maxY - minY) / 3;
    const top = CHART_PADDING.top;
    const bottom = CHART_HEIGHT - CHART_PADDING.bottom;
    const drawableH = bottom - top;
    return [
      { val: maxY, y: top },
      { val: minY + step * 2, y: top + drawableH * 0.333 },
      { val: minY + step, y: top + drawableH * 0.667 },
      { val: minY, y: bottom },
    ];
  }, [bounds]);

  // X-axis date labels
  const xTicks = useMemo<{ label: string; x: number; anchor?: "start" | "middle" | "end" }[]>(() => {
    if (scaledPoints.length === 0) return [];
    if (scaledPoints.length === 1) {
      return [{ label: formatDate(scaledPoints[0].original.date), x: scaledPoints[0].x, anchor: "middle" }];
    }
    const first = scaledPoints[0];
    const last = scaledPoints[scaledPoints.length - 1];
    const midIdx = Math.floor(scaledPoints.length / 2);
    const mid = scaledPoints[midIdx];

    return [
      { label: formatDate(first.original.date), x: first.x, anchor: "start" },
      { label: formatDate(mid.original.date), x: mid.x, anchor: "middle" },
      { label: formatDate(last.original.date), x: last.x, anchor: "end" },
    ];
  }, [scaledPoints]);

  if (!data || data.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.emptyState}>
          <p>No performance history available</p>
        </div>
      </div>
    );
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (scaledPoints.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    const svgX = (clientX / svgRect.width) * width;

    // Find closest point by x coordinate
    let closest = scaledPoints[0];
    let minDiff = Math.abs(svgX - closest.x);

    for (let i = 1; i < scaledPoints.length; i++) {
      const diff = Math.abs(svgX - scaledPoints[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = scaledPoints[i];
      }
    }

    setHoveredPoint(closest);
  };

  const handlePointerLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <div className={styles.chartWrapper}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          role="img"
          aria-label="Portfolio performance value chart"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="85%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                className={styles.gridLine}
              />
              <text
                x={padding.left - 8}
                y={tick.y + 3.5}
                className={`${styles.axisText} ${styles.axisTextEnd}`}
              >
                {formatCompactCurrency(tick.val)}
              </text>
            </g>
          ))}

          {/* Area under curve */}
          {areaPath && (
            <path d={areaPath} fill={`url(#${gradientId})`} />
          )}

          {/* Stroke Line */}
          {linePath && (
            <path d={linePath} className={styles.chartLine} />
          )}

          {/* Single point fallback */}
          {scaledPoints.length === 1 && (
            <circle
              cx={scaledPoints[0].x}
              cy={scaledPoints[0].y}
              r={5}
              className={styles.singlePoint}
            />
          )}

          {/* Active Hover Crosshair and Dot */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={height - padding.bottom}
                className={styles.crosshair}
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={9}
                className={styles.hoverPointPulse}
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={4.5}
                className={styles.hoverPoint}
              />
            </g>
          )}

          {/* X-Axis Dates */}
          {xTicks.map((tick, idx) => (
            <text
              key={idx}
              x={tick.x}
              y={height - 10}
              className={`${styles.axisText} ${
                tick.anchor === "start"
                  ? ""
                  : tick.anchor === "end"
                  ? styles.axisTextEnd
                  : styles.axisTextMiddle
              }`}
            >
              {tick.label}
            </text>
          ))}

          {/* Invisible interactive overlay to capture all pointer events */}
          <rect
            x={padding.left}
            y={padding.top}
            width={width - padding.left - padding.right}
            height={height - padding.top - padding.bottom}
            className={styles.overlayRect}
          />
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className={styles.tooltip}
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${Math.max(10, (hoveredPoint.y / height) * 100 - 15)}%`,
              transform:
                hoveredPoint.x > width * 0.75
                  ? "translate(-100%, -100%)"
                  : hoveredPoint.x < width * 0.25
                  ? "translate(0%, -100%)"
                  : "translate(-50%, -100%)",
            }}
          >
            <span className={styles.tooltipDate}>
              {formatDate(hoveredPoint.original.date)}
            </span>
            <span className={styles.tooltipValue}>
              {formatCurrency(hoveredPoint.original.marketValue, currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
