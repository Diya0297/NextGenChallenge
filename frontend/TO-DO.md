# Frontend Task Split (3 people, async / spec-driven)

## Phase 0: Shared contract (all 3, do first, ~10 min)
Agree on this before splitting off, so work can proceed in parallel without merge conflicts:
- **Data shapes** — TypeScript interfaces for portfolio summary, holding, time-series point, allocation entry (based on the JSON examples in `frontend/REQUIREMENTS.md`)
- **Global state** — selected account, selected currency, selected date range. Agree where this lives (e.g. one React Context) before it's built.
- **Folder ownership** — each person works only in their own component folder, so no two people touch the same file.
- **Shell interface** — Person A defines the layout slots (header, summary region, table region, chart region) so B and C know where their components plug in.

Reference: `frontend/REQUIREMENTS.md` has Goal / Inputs / Expected Behaviour / Edge Cases / Definition of Done for every task below — use it as the spec, don't rewrite it.

## Person A — Shell, Data layer, Summary, Currency
- [ ] Task 1: App shell / layout
- [ ] Shared data-fetching utility (fetch from mock server at `http://localhost:4000`, used by all three)
- [ ] Task 2: Portfolio Summary Card
- [ ] Task 7: Currency toggle (CAD ↔ USD)

## Person B — Holdings, Detail view, Top Movers
- [ ] Task 3: Holdings Table (sortable)
- [ ] Task 9: Detailed Holding View (click-through from table)
- [ ] Task 10: Top Movers widget

## Person C — Charts, Date range, Account selector
- [ ] Task 4: Portfolio Value Line Chart
- [ ] Task 5: Asset Allocation Chart
- [ ] Task 6: Date-range selector (filters own line chart)
- [ ] Task 8: Account/portfolio selector (stretch — touches shared state, do last)

## Testing
- Unit tests (Vitest or equivalent) on the logic most likely to have bugs: sort comparator, currency conversion math, empty-state rendering.
- Manual click-through checklist against `?scenario=empty` and `?scenario=large` datasets, logged in `NOTES.md`, if no time for automated E2E.

## Notes
- Include setup steps, how to run tests, and any assumptions/unfinished work in `NOTES.md` per the challenge instructions.
