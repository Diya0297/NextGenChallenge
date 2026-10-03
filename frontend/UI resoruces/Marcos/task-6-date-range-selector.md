# Task 6: Date-Range Selector (Person C, Marcos)

Branch: `marcos-branch` · App: `frontend/solution/` (Next.js + TypeScript)

## What it does

- Adds a **Date-Range Selector** pill bar inside the Portfolio Value card.
- Options: `1D`, `1M`, `YTD`, `1Y`, `All`.
- Selecting an option dynamically filters the `PortfolioValueChart` to show data in that time window.
- The currently active range option is visually highlighted.

## Requirements & Edge Cases

- **Graceful Fallback:** If the dataset contains less history than the requested range (e.g. `1Y` selected but only 60 days exist), it displays all available history without erroring.
- **YTD Calculation:** Calculated from January 1 of the reference year.
- **Default Range:** Defaults to `All` or `1Y`.
- **Keyboard & Screen Reader Accessible:** Uses accessible buttons with `aria-pressed` / `role="radiogroup"`.

## Component Structure

- `components/charts/DateRangeSelector.tsx`
- `components/charts/DateRangeSelector.module.css`
- Integrated into `PortfolioValueSection.tsx` alongside `PortfolioValueChart.tsx`.
- Unit tests in `DateRangeSelector.test.tsx` and updated `PortfolioValueChart.test.tsx`.
