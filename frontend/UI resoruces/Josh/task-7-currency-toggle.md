# Task 7: Currency Toggle CAD ↔ USD (Person A, Josh)

## What it does

- A **CAD | USD switch** in the top-right of the header. The selected side is highlighted.
- The **current rate is always shown** next to the switch: `1 CAD = 0.73 USD` (loaded once from `/exchange-rate`). It says "Loading rate…" while waiting and "Rate unavailable" if the request fails. Added after our teacher's feedback.
- Switching converts dollar figures instantly: **no page reload and no new data requests**.
- **Percentages never change** (day change %, total return, weight %).
- The currency is always clear: CAD shows `$65,680.00`, USD shows `US$47,946.40`, and the summary label says `Total Market Value · USD`.
- If the exchange rate can't load, **USD is disabled** and the dashboard stays in CAD rather than showing wrong numbers.

## ⚠️ Teammates: what you must do for this to work in your component

The toggle can only convert values that go through the shared `money` helper.
**Never format a dollar amount with your own code.**

```tsx
const { money } = useDashboard();

money.format(holding.marketValue)      // "$27,300.00" or "US$19,929.00"
money.formatSigned(holding.gainLoss)   // "+$3,300.00" or "+US$2,409.00"
money.convert(point.marketValue)       // a number, for chart axes and tooltips
```

| Who | Values that must use `money` |
|---|---|
| **Person B** | Holdings table: price, market value, gain/loss. Detail view: cost basis, 52-week high/low, price history. |
| **Person C** | Value chart: line values, y-axis labels, tooltip. Allocation chart: segment values (percentages stay as they are). |

**Don't use `money` for:** quantity, weight %, day change %, dividend yield, or any other percentage.

### Why it's built this way

- **One converter for the whole app.** A value can't be converted in one card and forgotten in another, which the brief calls out.
- **Convert raw values, round once at the end.** If you need a total, add up the raw values and format the total. Never add already-rounded numbers. Then the table total always matches the summary.
- **Currency lives in shared state**, separate from sort order, date range and selected account, so switching currency doesn't reset any of them.

## How to check

1. Open `http://localhost:3000`. The summary shows `$65,680.00` and `+$397.25 (+0.61%)`.
2. Click **USD**. It changes to `US$47,946.40` and `+US$289.99 (+0.61%)`. The % values stay the same.
3. Click **CAD**. It goes back to the original numbers.
4. Next to the switch you should see `1 CAD = 0.73 USD`. Try `http://localhost:3000/?fail=true`: it should say "Rate unavailable" and USD should be greyed out.
5. Once B and C have built their cards, click USD and check that **every** dollar value on the page changed, and that the sort order, date range and account stayed the same.

## Tests

- `lib/currency.test.ts`: CAD unchanged, USD × rate, labels, and converted parts adding up to the converted total.
- `components/currency/CurrencyToggle.test.tsx`: starts on CAD; USD converts money but not percentages; switching back makes no new requests; shows the current rate; shows "Rate unavailable" and disables USD if the rate fails.
- `components/layout/Header.test.tsx`: the toggle is in the header.

## Still to verify (once B and C are merged)

- [ ] Holdings table values convert
- [ ] Detail view values convert
- [ ] Value chart and tooltip convert
- [ ] Sort order, date range and selected account are kept after switching
