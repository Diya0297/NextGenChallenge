# Portfolio Dashboard (Frontend track)

A wealth management dashboard that shows what a client owns, what it's worth, and how that has changed over time. Built with **Next.js 16, React 19 and TypeScript**, tested with **Vitest** and **React Testing Library**.

Team notes and design decisions live in `frontend/UI resoruces/` (one folder per person).

## Install and run

You need **Node.js 24**.

```sh
# Terminal 1, from the repository root: start the supplied mock API (port 4000)
node frontend/mock-server.mjs

# Terminal 2: install and start the app (port 3000)
cd frontend/solution
npm install
npm run dev
```

Open <http://localhost:3000>. If the mock API isn't running, the dashboard says so and offers **Try again**.

To use a different API address, set `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).

## Run the tests

```sh
cd frontend/solution
npm test          # unit and component tests
npm run lint      # code style checks
npm run build     # production build, including the TypeScript check
```

Tests replace `fetch` with fake responses, so the mock API doesn't need to be running for them.

## Try the edge cases in the browser

The app passes the mock API's test options through from its own URL:

| URL | Shows |
|---|---|
| `/?scenario=negative` | Losses: red values, down arrows |
| `/?scenario=zero` | Zero change: neutral grey values |
| `/?scenario=large-value` | Very large numbers |
| `/?scenario=empty` | An account with no holdings |
| `/?scenario=single-account` | Only one account |
| `/?delayMs=3000` | Loading states |
| `/?fail=true` | Error states with Try again |

The full list is in `support/PORTFOLIO-API.md`.

## How it's organised

| Folder | Contents |
|---|---|
| `app/` | Page layout (`layout.tsx`), overview page (`page.tsx`), design tokens (`globals.css`) |
| `components/providers/` | `DashboardProvider`: shared data and settings for the whole page |
| `components/<feature>/` | One folder per feature (`summary/`, `currency/`, …) |
| `components/ui/` | Shared building blocks (`Card`, `StatusMessage`) |
| `lib/` | Data types, API calls, formatting and currency conversion |
| `test/` | Test helpers (fake mock API responses) |

- **Data is loaded once per account** in `DashboardProvider` and shared through `useDashboard()`, so every card shows the same account and moment in time.
- **Every dollar value goes through `money.format` / `money.convert`**, so the CAD/USD toggle converts everything consistently.

## Assumptions

- All API money values are in **CAD**. USD values use the mock's fixed rate (`0.73`).
- **Today's exchange rate is applied to all values, including past chart values.** A production version might use the historical rate for each date.
- The API uses two percent units (`2.4` = 2.4% for day change and weight; `0.187` = 18.7% for total return). `lib/format.ts` has a helper for each.
- The first account is shown until another is selected.
- If the exchange rate fails to load, USD is disabled and figures stay in CAD rather than showing wrong numbers.

## Progress

| # | Task | Owner | Status |
|---|---|---|---|
| 1 | App shell | Josh | ✅ Done |
| 2 | Portfolio summary card | Josh | ✅ Done |
| 3 | Holdings table | Person B | |
| 4 | Value line chart | Person C | |
| 5 | Asset allocation chart | Person C | |
| 6 | Date-range selector | Person C | |
| 7 | CAD/USD toggle | Josh | ✅ Done for the summary. Other cards convert once they use `money` |
| 8 | Account selector | Person C | Shared state ready (`accountId`, `setAccountId`) |
| 9 | Holding detail view | Person B | |
| 10 | Top movers | Person B | |

## Known issues

- `npm install` reports 5 high-severity advisories in packages that come with Next.js's starter. They don't affect the app's own code; fixing them needs `npm audit fix --force`, which may break the setup, so it was left alone.
