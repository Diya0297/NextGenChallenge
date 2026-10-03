# Task 5: Asset Allocation Donut Chart (Person C, Marcos)

Branch: `marcos-branch` · App: `frontend/solution/` (Next.js + TypeScript)

## What it does

- Renders a **donut chart** showing portfolio distribution across asset classes (e.g., Equity, Fixed Income, Cash, Alternatives).
- Each segment is visually distinct and color-coded.
- Includes a clean legend with asset class names, percentages, and dollar amounts.
- Hovering over a segment or legend item highlights the corresponding segment and displays a tooltip with details.

## Inputs (Mock Data)

```json
[
  { "assetClass": "Equity", "value": 289410.0 },
  { "assetClass": "Fixed Income", "value": 120500.0 },
  { "assetClass": "Cash", "value": 42340.12 },
  { "assetClass": "Alternatives", "value": 30100.0 }
]
```

## Edge Cases Handled

- **100% in one category:** Complete circle without SVG arc calculation errors.
- **Tiny allocation (<1%):** Guaranteed minimum visible angle so small slices do not disappear.
- **Empty state:** Friendly fallback when allocation data is empty.

## Component Structure

- `components/charts/AssetAllocationChart.tsx`
- `components/charts/AssetAllocationChart.module.css`
- `components/charts/AssetAllocationSection.tsx` (fetches from mock server with fallback)
- `components/charts/AssetAllocationChart.test.tsx`
