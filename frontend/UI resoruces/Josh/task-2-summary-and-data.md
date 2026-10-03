# Task 2: Portfolio Summary Card + shared data layer (Person A, Josh)

## What it does

- The **Portfolio Summary** card shows live data for the selected account:
  - **Total Market Value**, e.g. `$65,680.00`
  - **Day Change** as dollars and percent, e.g. `+$397.25 (+0.61%)`, with an up/down/flat icon
  - **Total Return Since Inception**, e.g. `+18.7%`
- **Green** = gain, **red** = loss, **grey** = exactly zero (never styled as positive or negative).
- The +/- sign and the icon show direction too, so colour isn't the only signal (better for colour-blind users).
- Very large values (e.g. `$65,680,000,000.00`) keep their separators and wrap instead of overflowing.
- Shows **"Loading…"** while data arrives, and an **error with a "Try again" button** if the request fails.

## Shared pieces for the whole team

| File | What it gives you |
|---|---|
| `lib/types.ts` | TypeScript shapes of all mock API data (`Holding`, `PerformancePoint`, `AllocationEntry`, …) |
| `lib/format.ts` | `formatMoney`, `formatSignedMoney`, `formatPercent`, `formatFractionAsPercent`, `getDirection` |
| `lib/api.ts` / `lib/useApi.ts` | Fetch from the mock API with loading/error/retry handled |
| `components/providers/DashboardProvider.tsx` | Shared state: accounts, selected account, portfolio data, currency, date range |
| `components/ui/StatusMessage.tsx` | Standard "Loading…" / error + "Try again" display |

### How to use the shared data in your component

```tsx
"use client";
import { useDashboard } from "@/components/providers/DashboardProvider";
import StatusMessage from "@/components/ui/StatusMessage";
import { formatMoney } from "@/lib/format";

export default function HoldingsTable() {
  const { portfolio, currency } = useDashboard();
  if (portfolio.status !== "success") return <StatusMessage state={portfolio} />;

  const holdings = portfolio.data.holdings;
  // ... use formatMoney(holding.marketValue, currency) for every dollar value
}
```

- **Holdings, chart history and allocation are already loaded**: `portfolio.data.holdings`, `.performanceHistory`, `.allocation`. No need to fetch them again.
- **Person C:** `accounts`, `accountId`, `setAccountId`, `dateRange` and `setDateRange` are ready for Tasks 6 and 8.
- **Always use `formatMoney` for dollar values**, so the CAD/USD toggle (Task 7) works everywhere.

### The percentage trap

The API uses two units. Use the right helper:

| Field | Means | Helper |
|---|---|---|
| `dayChangePercent`, `weightPercent` | `2.4` = 2.4% | `formatPercent(2.4)` → `+2.40%` |
| `totalReturnSinceInception`, `dividendYield` | `0.187` = 18.7% | `formatFractionAsPercent(0.187)` → `+18.7%` |

## Testing edge cases in the browser

Add the mock's test options to the app's URL. They are passed through to every API request:

| URL | Shows |
|---|---|
| `http://localhost:3000/?scenario=negative` | Red loss state |
| `http://localhost:3000/?scenario=zero` | Grey neutral state |
| `http://localhost:3000/?scenario=large-value` | Very large numbers |
| `http://localhost:3000/?delayMs=3000` | Loading message |
| `http://localhost:3000/?fail=true` | Error message + Try again |

## How to run

```sh
# Terminal 1, from the repo root
node frontend/mock-server.mjs

# Terminal 2
cd frontend/solution
npm run dev     # http://localhost:3000
npm test
```

## Tests (29 in total, all passing)

- `lib/format.test.ts`: money, signs, both percent units, zero = neutral, large values.
- `lib/api.test.ts`: URL building, API error messages, "mock server not running" message.
- `components/summary/SummaryCard.test.tsx`: the brief's sample data; positive, negative and zero states; updates when data changes.
- `components/summary/PortfolioSummary.test.tsx`: loading → data; error → Try again → data.
- `app/page.test.tsx`: heading, all five card slots, summary fills with live data.

## Decisions

- **All data is fetched once per account** and shared, so every card always shows the same account and the same moment in time.
- **The summary card is split in two**: `SummaryCard` only displays numbers (easy to test), and `PortfolioSummary` connects it to the data.
- **The dashboard shows the first account by default** until one is picked (Task 8).
