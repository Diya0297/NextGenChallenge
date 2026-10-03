# Decisions log (Josh, Person A)

A one-page summary of the choices behind my part, and why. Details are in the task notes in this folder.

## Team and process

| Decision | Why |
|---|---|
| **I built the shell and shared pieces first and pushed them to `main` early** | B and C needed a common structure. Without it, three separate apps would clash when merged. |
| **One card slot per teammate in `app/page.tsx`** | Everyone works in their own files and only changes one line of the shared page, so conflicts stay small. |
| **Small commits pushed often** | Teammates get shared code sooner, and any problem is easy to trace back. |

## Tools

| Decision | Why |
|---|---|
| **Next.js** (team decision) | React-based, widely used, and it organises pages and layouts for us. |
| **Plain CSS with variables and CSS modules** | The design gave exact colour values. Defining them once as variables keeps every card consistent. |
| **Vitest + React Testing Library** | The test setup recommended in Next.js's own docs. Tests check what the user sees, not internal details. |

## Design

| Decision | Why |
|---|---|
| **Dark mockup** (`design/dashboard-mockup.jpg`) | The team tried a light Electric Mind–style spec, then agreed on the dark mockup. |
| **Inter font, not Electric Mind's fonts** | Electric Mind's fonts (FT System) are licensed for their own site, so we didn't copy them. |
| **Numbers use tabular figures** | Digits line up vertically in tables and cards, which matters for financial data. |
| **Followed the brief where the mockup disagreed** | The mockup showed Top Movers in dollars, but the brief asks for day change %. The requirements are the spec. |
| **Kept a "Portfolio Overview" heading; left out profile and bell icons** | The heading is required by Task 1. The icons aren't in the requirements. |

## Data

| Decision | Why |
|---|---|
| **Load each account's data once and share it** (`DashboardProvider`) | Every card shows the same account and moment in time, and the mock isn't called five times. |
| **Loading and error messages with "Try again"** on every card | The brief doesn't ask for them, but real networks fail. The mock's `fail=true` and `delayMs` options let us test them. |
| **Pass `?scenario=` from the page URL to the API** | Any edge case can be shown in the browser during the demo, with no code changes. |
| **Clear message when the mock server isn't running** | The most likely setup mistake gets an obvious explanation. |
| **Two percent helpers** | The API uses two units (`2.4` = 2.4%, `0.187` = 18.7%). A named helper for each prevents mixing them up. |

## Summary card (Task 2)

| Decision | Why |
|---|---|
| **Zero is grey, never green or red** | Required by the brief, and honest: no change is neither good nor bad. |
| **Arrows and +/- signs as well as colour** | Colour-blind users can still tell gains from losses. |
| **Split into `SummaryCard` (display) and `PortfolioSummary` (data)** | The display part can be tested with the brief's exact sample data. |

## Currency toggle (Task 7)

| Decision | Why |
|---|---|
| **One shared `money` converter** | A value can't be converted in one card and forgotten in another, which the brief warns about. |
| **Convert raw values, round only when displaying** | Totals always match. Rounding at different steps would make them disagree by cents. |
| **Exchange rate loaded once; switching makes no requests** | Instant, and sort order, date range and account are untouched. |
| **Rate always shown next to the switch** (`1 CAD = 0.73 USD`) | Clients can see what conversion is being applied, as our teacher suggested. |
| **USD disabled if the rate fails to load** | Better to stay in CAD than to show wrong numbers. |
| **`US$` prefix for USD** | Makes the currency obvious next to every figure. |

## Assumptions and open questions

- **Today's rate is used for past values in the chart.** A real product might use each date's historical rate. An open question for the Electric Mind team.
- **The fixed fictional rate (0.73)** comes from the mock. In production it would come from a live source with an "as of" time.
- **The first account is shown by default** until one is chosen (Task 8).

## What I'd do next with more time

- Show when data was last updated (the API's `asOf` time).
- Remember the client's chosen currency between visits.
- Browser-level end-to-end tests (e.g. Playwright) once all cards are merged.
