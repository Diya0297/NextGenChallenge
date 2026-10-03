# Task 1: App Shell (Person A, Josh)

Branch: `josh` · App: `frontend/solution/` (Next.js + TypeScript)

## What it does

- Loads to a **Portfolio Overview** page.
- A **header** stays at the top of every page, with slots for the account selector (left, Task 8) and the CAD/USD toggle (right, Task 7).
- The page has **five card slots**, one per dashboard section, so each teammate has a clear place to build.
- No dashboard data is hardcoded. Each card shows a placeholder until its component is built.

## Design followed

The team agreed to use the **dark mockup**: `frontend/UI resoruces/design/dashboard-mockup.jpg` and its notes in `design/README.md`.
`design.md`, `mockup.html` and `design - Diya .md` (the light and green designs) are **no longer used**.

| Token (in `app/globals.css`) | Value | Use for |
|---|---|---|
| `--bg` | `#0B0F19` | Page background |
| `--surface` | `#151E2E` | Cards and controls |
| `--border` | `rgba(255,255,255,0.08)` | Subtle card border |
| `--text` / `--muted` | `#F1F5F9` / `#94A3B8` | Main and secondary text |
| `--positive` | `#10B981` | Gains only |
| `--negative` | `#EF4444` | Losses only |
| `--accent` | `#38BDF8` | Highlights and focus |
| `--radius` | `12px` | Card corners |

- **Font:** Inter everywhere. Numbers use tabular figures so they line up in columns.
- **Always use the variables**, not raw hex codes, so the whole app stays consistent.

## Layout

```text
┌ Account selector                         CAD / USD ┐  ← header (sticky, see-through)
│ Portfolio Overview                                 │
│ ┌ Portfolio Summary ───────────────────────────────┐│
│ ┌ Portfolio Value ─────────────┐ ┌ Asset Allocation┐│
│ ┌ Top Movers ┐ ┌ Holdings ─────────────────────────┐│
```

On screens narrower than 900px, the cards stack into one column.

## How teammates plug in

1. Build your component in your own folder, e.g. `components/holdings/HoldingsTable.tsx`.
2. In `app/page.tsx`, replace the placeholder `<p>` inside your card with your component:

   ```tsx
   <Card title="Holdings" className={styles.holdings}>
     <HoldingsTable />
   </Card>
   ```

3. Don't edit `Card`, `Header` or `globals.css` without telling Josh, because everyone shares them.

## Files

| File | What it does |
|---|---|
| `app/layout.tsx` | Frame around every page: loads the font and the header |
| `app/page.tsx` | The overview page and its five card slots |
| `app/page.module.css` | The grid layout |
| `app/globals.css` | Design tokens (colours, spacing, font) |
| `components/layout/Header.tsx` | The top bar |
| `components/ui/Card.tsx` | Shared box used by every section |

## How to run and test

See `frontend/solution/README.md` for full setup. In short: start the mock API with `node frontend/mock-server.mjs` from the repo root, then `npm install`, `npm run dev` and `npm test` in `frontend/solution`.

**Shell tests:**

- `components/ui/Card.test.tsx`: shows its title, shows its contents, keeps its grid class.
- `components/layout/Header.test.tsx`: renders as the page banner, with the account slot and the currency toggle.
- `app/page.test.tsx`: shows the "Portfolio Overview" heading, all five card slots, and live summary data.

## Decisions and assumptions

- **Next.js** was chosen by the team. Components that respond to clicks will need `"use client"` at the top.
- **Cards are named after their titles** (`aria-labelledby`), so screen readers and tests can find each section.
- **A "Portfolio Overview" heading was kept**, even though the mockup has none, because the brief asks for it.
- **Profile and bell icons from the mockup were left out**, because they aren't in the requirements.

## Follow-up work (done)

- Shared data layer and Task 2 summary card: see `task-2-summary-and-data.md`.
- Task 7 currency toggle: see `task-7-currency-toggle.md`.
- All decisions in one place: see `decisions.md`.
