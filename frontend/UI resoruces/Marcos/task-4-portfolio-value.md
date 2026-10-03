# Task 4: Portfolio Value Line Chart — Technical Plan

**Role:** Person C (Marcos)  
**Branch:** `marcos-branch`  
**Target Location:** `frontend/solution/components/charts/PortfolioValueChart.tsx`

---

## 1. Objectives & Requirements
- Visualize the portfolio market value over time using a line chart.
- **X-Axis:** Date (formatted cleanly, e.g., `MMM DD` or `YYYY-MM-DD`).
- **Y-Axis:** Total Market Value (formatted with currency symbols and thousand separators).
- **Interactive Tooltip:** Hovering or tapping along the chart reveals a vertical crosshair and a tooltip showing the exact date and currency value.
- **Responsive & Design-system Aligned:** Fits within the designated `Card` slot and respects dark-mode tokens (`--accent`, `--surface`, `--border`, `--muted`, `--text`).

---

## 2. Technology & Approach: Native SVG
Instead of introducing heavy external charting dependencies (like `recharts` or `chart.js` which frequently encounter React 19 / Turbopack peer dependency issues), we will implement a **custom, lightweight React SVG chart**:
- **Zero dependencies:** Works out-of-the-box in Next.js 16 & React 19.
- **Pixel-perfect control:** Full CSS variable integration (`var(--accent)` for stroke, subtle linear gradient for area fill).
- **Responsive:** Scales seamlessly using SVG `viewBox` and `preserveAspectRatio`.
- **Fast rendering:** Instantaneous calculations, no canvas resizing lag or hydration mismatch.

---

## 3. Data Contract & Mock API Integration

### Data Input Shape
Matches the mock API endpoint (`/portfolios/:id` -> `performanceHistory`):
```typescript
export interface TimeSeriesPoint {
  date: string;       // ISO date "YYYY-MM-DD"
  marketValue: number; // e.g. 418200.0
}
```

### Component Props Interface
```typescript
export interface PortfolioValueChartProps {
  data?: TimeSeriesPoint[];
  isLoading?: boolean;
  currency?: 'CAD' | 'USD';
  height?: number;
}
```

---

## 4. Visual & UI Design Specs (per `finance-ui-design`)
- **Line stroke:** 2px stroke width, color `var(--accent)` (`#38BDF8`).
- **Area under curve:** Subtle vertical gradient from `rgba(56, 189, 248, 0.15)` at the top fading to `rgba(56, 189, 248, 0.0)` at the bottom.
- **Gridlines & Ticks:** 3–4 horizontal subtle dotted/dashed gridlines (`var(--border)`).
- **Axes:**
  - Y-axis labels aligned right in muted font (`var(--muted)`, tabular figures).
  - X-axis labels at key intervals (e.g. first date, middle date, last date).
- **Interactive Hover Indicator:**
  - Vertical crosshair line (`rgba(255, 255, 255, 0.2)`).
  - Highlight circle point on the curve with an outer glow.
  - Floating tooltip box (`background: var(--surface)`, `border: 1px solid var(--border)`).

---

## 5. Edge Cases & Resilience Strategy

| Edge Case | Strategy |
|---|---|
| **Empty dataset (`[]`)** | Render an empty state placeholder ("No performance history available") without crashing. |
| **Single point (`n = 1`)** | Center a single circular dot in the middle of the chart area with the y-value centered vertically (avoid `min === max` division by zero). |
| **Two points (`n = 2`)** | Render a straight diagonal or horizontal line spanning from left to right. |
| **Flat values (`min === max`)** | Add an artificial padding buffer (`val * 0.9` to `val * 1.1`) to avoid `0 / 0 = NaN` coordinate scaling. |
| **Date gaps** | Preserve chronological order based on index or date timestamp without distorted curves. |
| **Extremely large numbers** | Abbreviate Y-axis labels when necessary (e.g. `$450K`, `$1.2M`) to prevent overflow. |

---

## 6. Implementation Steps

1. **Step 1: Math & Geometry Utility (`utils/chartMath.ts`)**
   - Min/max calculations with safety padding.
   - Coordinate transformation function `(x, y)` from data domain to SVG coordinate space.
   - SVG path generator for the line (`d="M x0 y0 L x1 y1..."`) and closed area fill (`d="... Z"`).

2. **Step 2: Component Layout & SVG Canvas (`PortfolioValueChart.tsx`)**
   - Render SVG with dynamic `viewBox` (e.g. `0 0 600 300`).
   - Draw background gridlines and axis tick labels.
   - Draw the area gradient `<path>` and stroke line `<path>`.

3. **Step 3: Interactive Tooltip & Event Handling**
   - Overlay an invisible full-width pointer tracking rect.
   - Track pointer position via `onPointerMove`, find nearest data point by X coordinate.
   - Render cursor circle and floating tooltip pill.

4. **Step 4: Integration with Shell (`app/page.tsx`)**
   - Connect to the mock data or props within Josh's `<Card title="Portfolio Value">`.

---

## 7. Testing Plan (`PortfolioValueChart.test.tsx`)
- [ ] Renders empty state message when data is empty.
- [ ] Renders without errors when given 1 point (`?scenario=one-point`).
- [ ] Renders without errors when given 2 points (`?scenario=two-points`).
- [ ] Renders multi-point dataset and SVG paths correctly (`default` scenario).
- [ ] Verifies tooltip appears when hovering over chart points.
