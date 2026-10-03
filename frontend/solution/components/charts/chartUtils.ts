export interface TimeSeriesPoint {
  date: string;
  marketValue: number;
}

export interface ChartBounds {
  minY: number;
  maxY: number;
}

/**
 * Format a number into currency with 2 decimals or 0 decimals depending on need.
 */
export function formatCurrency(
  value: number,
  currency: 'CAD' | 'USD' = 'CAD'
): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format large numbers for Y-axis labels concisely (e.g. $420k, $1.2M).
 */
export function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${Math.round(value / 1_000)}k`;
  }
  return `$${Math.round(value)}`;
}

/**
 * Format date string (YYYY-MM-DD) for axis labels and tooltips.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]} ${day}, ${year}`;
    }
  }
  return dateStr;
}

/**
 * Compute min and max values with safety buffers to avoid 0 division and edge touching.
 */
export function computeYBounds(data: TimeSeriesPoint[]): ChartBounds {
  if (!data || data.length === 0) {
    return { minY: 0, maxY: 100 };
  }

  let min = data[0].marketValue;
  let max = data[0].marketValue;

  for (let i = 1; i < data.length; i++) {
    const val = data[i].marketValue;
    if (val < min) min = val;
    if (val > max) max = val;
  }

  // Handle flat dataset or 1-point dataset
  if (min === max) {
    const buffer = min === 0 ? 100 : Math.abs(min) * 0.1;
    return {
      minY: Math.max(0, min - buffer),
      maxY: max + buffer,
    };
  }

  // Add 5% padding to top and bottom
  const range = max - min;
  const padding = range * 0.08;

  return {
    minY: Math.max(0, min - padding),
    maxY: max + padding,
  };
}

export interface ScaledPoint {
  x: number;
  y: number;
  original: TimeSeriesPoint;
}

/**
 * Project raw data points into pixel coordinates within the drawing area.
 */
export function projectPoints(
  data: TimeSeriesPoint[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  bounds: ChartBounds
): ScaledPoint[] {
  if (!data || data.length === 0) return [];

  const drawableWidth = Math.max(1, width - padding.left - padding.right);
  const drawableHeight = Math.max(1, height - padding.top - padding.bottom);
  const rangeY = Math.max(0.0001, bounds.maxY - bounds.minY);

  if (data.length === 1) {
    // Single point: place in the center horizontally
    const yRatio = (data[0].marketValue - bounds.minY) / rangeY;
    const y = padding.top + drawableHeight * (1 - yRatio);
    const x = padding.left + drawableWidth / 2;
    return [{ x, y, original: data[0] }];
  }

  const stepX = drawableWidth / (data.length - 1);

  return data.map((pt, idx) => {
    const x = padding.left + idx * stepX;
    const yRatio = (pt.marketValue - bounds.minY) / rangeY;
    const y = padding.top + drawableHeight * (1 - yRatio);
    return { x, y, original: pt };
  });
}

/**
 * Construct SVG path line command ("M x0 y0 L x1 y1 ...")
 */
export function buildLinePath(points: ScaledPoint[]): string {
  if (points.length < 2) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
}

/**
 * Construct SVG closed area path command ("M x0 y0 ... L x_n bottom L x0 bottom Z")
 */
export function buildAreaPath(
  points: ScaledPoint[],
  bottomY: number
): string {
  if (points.length < 2) return '';
  const linePart = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePart} L ${last.x.toFixed(2)} ${bottomY.toFixed(2)} L ${first.x.toFixed(2)} ${bottomY.toFixed(2)} Z`;
}

export interface AllocationEntry {
  assetClass: string;
  value: number;
}

export interface DonutSlice {
  assetClass: string;
  value: number;
  percent: number;
  color: string;
  path: string;
  isFullCircle?: boolean;
}

const ASSET_CLASS_PALETTE: Record<string, string> = {
  Equity: "#38BDF8", // Sky blue
  "Fixed Income": "#818CF8", // Indigo
  Cash: "#34D399", // Emerald
  Alternatives: "#F472B6", // Pink
};

const FALLBACK_PALETTE = [
  "#FBBF24", // Amber
  "#A78BFA", // Violet
  "#2DD4BF", // Teal
  "#FB923C", // Orange
  "#E879F9", // Fuchsia
];

export function getAssetClassColor(assetClass: string, index: number): string {
  if (ASSET_CLASS_PALETTE[assetClass]) {
    return ASSET_CLASS_PALETTE[assetClass];
  }
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}

/**
 * Calculates SVG arc paths for donut chart slices.
 * Handles edge cases like 100% single category and tiny allocations (<1%).
 */
export function buildDonutSlices(
  items: AllocationEntry[],
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
): DonutSlice[] {
  if (!items || items.length === 0) return [];

  const positiveItems = items.filter((item) => item.value > 0);
  if (positiveItems.length === 0) return [];

  const total = positiveItems.reduce((acc, curr) => acc + curr.value, 0);

  // Single category (100%) edge case
  if (positiveItems.length === 1) {
    const item = positiveItems[0];
    const color = getAssetClassColor(item.assetClass, 0);
    // Draw two 180-degree arcs to form a complete donut ring
    const path = [
      `M ${cx} ${cy - outerR}`,
      `A ${outerR} ${outerR} 0 1 1 ${cx} ${cy + outerR}`,
      `A ${outerR} ${outerR} 0 1 1 ${cx} ${cy - outerR}`,
      `M ${cx} ${cy - innerR}`,
      `A ${innerR} ${innerR} 0 1 0 ${cx} ${cy + innerR}`,
      `A ${innerR} ${innerR} 0 1 0 ${cx} ${cy - innerR}`,
      `Z`,
    ].join(" ");

    return [
      {
        assetClass: item.assetClass,
        value: item.value,
        percent: 100,
        color,
        path,
        isFullCircle: true,
      },
    ];
  }

  // Multi-item breakdown
  // Minimum angle of 0.05 radians (~3 degrees) to ensure tiny allocations (<1%) remain visible
  const minAngle = 0.05;
  const rawRatios = positiveItems.map((item) => item.value / total);
  
  // Allocate minimum angle to small slices and distribute remaining angle
  const twoPi = Math.PI * 2;
  const smallItemIndices = new Set(
    rawRatios.map((r, i) => (r * twoPi < minAngle ? i : -1)).filter((i) => i >= 0)
  );

  const reservedAngle = smallItemIndices.size * minAngle;
  const remainingAngle = Math.max(0.1, twoPi - reservedAngle);
  const remainingValueTotal = positiveItems
    .filter((_, i) => !smallItemIndices.has(i))
    .reduce((sum, item) => sum + item.value, 0);

  let currentAngle = -Math.PI / 2; // Start at top (12 o'clock)

  return positiveItems.map((item, idx) => {
    const isTiny = smallItemIndices.has(idx);
    const sweep = isTiny
      ? minAngle
      : (item.value / (remainingValueTotal || 1)) * remainingAngle;

    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;

    const cosStart = Math.cos(startAngle);
    const sinStart = Math.sin(startAngle);
    const cosEnd = Math.cos(endAngle);
    const sinEnd = Math.sin(endAngle);

    const x1 = cx + outerR * cosStart;
    const y1 = cy + outerR * sinStart;
    const x2 = cx + outerR * cosEnd;
    const y2 = cy + outerR * sinEnd;

    const x3 = cx + innerR * cosEnd;
    const y3 = cy + innerR * sinEnd;
    const x4 = cx + innerR * cosStart;
    const y4 = cy + innerR * sinStart;

    const largeArc = sweep > Math.PI ? 1 : 0;

    const path = [
      `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
      `Z`,
    ].join(" ");

    const percent = Math.round((item.value / total) * 1000) / 10;

    return {
      assetClass: item.assetClass,
      value: item.value,
      percent: percent < 0.1 && item.value > 0 ? 0.1 : percent,
      color: getAssetClassColor(item.assetClass, idx),
      path,
    };
  });
}

export type DateRangeOption = "1D" | "1M" | "YTD" | "1Y" | "All";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = ["1D", "1M", "YTD", "1Y", "All"];

/**
 * Filter time-series points according to the selected date range.
 * If the dataset contains less history than requested, falls back gracefully to all available data.
 */
export function filterTimeSeriesByRange(
  data: TimeSeriesPoint[],
  range: DateRangeOption,
  referenceDate?: Date
): TimeSeriesPoint[] {
  if (!data || data.length === 0 || range === "All") {
    return data || [];
  }

  const lastPoint = data[data.length - 1];
  const lastDate = referenceDate ?? new Date(`${lastPoint.date}T00:00:00Z`);

  let cutoffDate: Date;

  switch (range) {
    case "1D": {
      if (data.length <= 2) return data;
      cutoffDate = new Date(lastDate);
      cutoffDate.setUTCDate(cutoffDate.getUTCDate() - 1);
      break;
    }
    case "1M": {
      cutoffDate = new Date(lastDate);
      cutoffDate.setUTCMonth(cutoffDate.getUTCMonth() - 1);
      break;
    }
    case "YTD": {
      cutoffDate = new Date(Date.UTC(lastDate.getUTCFullYear(), 0, 1));
      break;
    }
    case "1Y": {
      cutoffDate = new Date(lastDate);
      cutoffDate.setUTCFullYear(cutoffDate.getUTCFullYear() - 1);
      break;
    }
    default:
      return data;
  }

  const cutoffStr = cutoffDate.toISOString().slice(0, 10);
  const filtered = data.filter((pt) => pt.date >= cutoffStr);

  // Edge case: if dataset has less history than requested, display what is available
  if (filtered.length === 0) {
    return data;
  }

  // For 1D, ensure at least 2 points are returned if data has >= 2 points
  if (range === "1D" && filtered.length < 2 && data.length >= 2) {
    return data.slice(-2);
  }

  return filtered;
}
