# Wealth Management Dashboard — Design Spec (Electric Mind theme, light mode)

This file supersedes `design/README.md` and `frontend/UI resoruces/design - Diya .md`.
It merges the layout/requirements-mapping from the first with the card/spacing/typography
system from the second, re-themed to Electric Mind's light-mode brand identity
(see Electric Mind homepage reference). **No dark mode.**

---

## 1. Theme Overview

- **Mode**: Light only. Off-white/warm-gray background, white card surfaces.
- **Brand influence**: Electric Mind — monospace technical headings, sharp/structural
  shapes, a single electric-blue accent, bold black typography, generous whitespace.
- **Visual effects**: subtle borders/shadows only (no glassmorphism, no glow/neon —
  those were dark-mode-only effects from the old draft and are dropped).

### Color tokens

```css
:root {
  --background: #F5F5F3;
  --surface: #FFFFFF;
  --surface-muted: #ECECEA;   /* used for the headline "highlight block" effect */

  --primary: #3B4CF5;         /* Electric Mind blue — buttons, active states, links */
  --primary-dark: #2733C7;
  --primary-subtle: #E8EAFD;

  --positive: #0A8F5A;        /* gains */
  --negative: #E2443A;        /* losses */
  --neutral: #6F746F;

  --text-primary: #0E0F10;    /* near-black, matches ElectricMind headline black */
  --text-secondary: #5B5F5B;
  --text-muted: #9A9E9A;

  --border: rgba(0, 0, 0, 0.08);

  --radius-card: 12px;        /* sharper than a generic SaaS pill style, on-brand */
  --radius-control: 8px;
  --radius-pill: 999px;       /* reserved for status/badge pills only, not buttons */

  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

### Color usage

- Backgrounds stay light/neutral everywhere — no dark cards, no dark nav.
- Blue (`--primary`) is the *only* brand accent: primary buttons, active nav/tab
  state, the account/currency selectors, links, selected chart bar/line.
- Green/red are reserved strictly for financial direction (gains/losses) — they are
  not brand colors and shouldn't appear on chrome/navigation.
- Headline numbers (e.g. total market value) may sit on a `--surface-muted` highlight
  block behind the text, echoing the Electric Mind homepage treatment of bold
  headline phrases.

---

## 2. Typography

- **Headings & key numbers**: monospace, bold/uppercase where it reads as a label
  (e.g. section titles, nav items) — this is the distinct Electric Mind signature.
  Suggested stack: `"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace`.
- **Body copy / table data / descriptions**: clean sans-serif for legibility at
  small sizes. Suggested stack: `Inter, "SF Pro", system-ui, sans-serif`.
- Do not use monospace for dense body text (holdings table rows, helper text) —
  only for headings, nav labels, and hero metrics, or it hurts scanability.

### Hierarchy

| Role | Size | Weight | Font |
|---|---|---|---|
| Hero heading ("Portfolio Overview") | 32–38px | Bold, uppercase tracking | Mono |
| Hero metric (Total Market Value) | 36–44px | Bold | Mono |
| Card title | 13–16px | Medium, uppercase | Mono |
| Table data / body | 13–14px | Regular | Sans |
| Helper / muted text | 11–12px | Regular | Sans |

---

## 3. Layout (mapped to frontend/REQUIREMENTS.md tasks)

```text
┌───────────────────────────────────────────────────────────────────────┐
│ ElectricMind-style top nav: Logo   Account Selector (8)   Currency(7) │
├───────────────────────────────────────────────────────────────────────┤
│  PORTFOLIO OVERVIEW                                                    │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐   │
│  │ Summary Card (2)             │  │ Top Movers (10)               │   │
│  │ Total value / day change /   │  │ Gainers | Losers              │   │
│  │ return since inception       │  │                                │   │
│  └─────────────────────────────┘  └──────────────────────────────┘   │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐   │
│  │ Line Chart (4) + Date Range  │  │ Allocation Donut (5)           │   │
│  │ Selector (6)                 │  │                                │   │
│  └─────────────────────────────┘  └──────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │ Holdings Table (3) — sortable, click row → Detail View (9)    │   │
│  └───────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
```

- **Top nav**: white, sharp-cornered (not pill-shaped like generic SaaS), sits flush
  with the page — matches the Electric Mind header reference, not the floating pill
  nav from the old light-mode draft.
- **Account Selector (Req 8)**: top-left, dropdown, labels only (e.g. "Taxable
  Brokerage — P-9001").
- **Currency Toggle (Req 7)**: top-right, two-way switch `CAD ↔ USD`, blue when
  active side is selected.

---

## 4. Components

### Cards
- White surface, `--radius-card` (12px, sharper than a soft SaaS 24px pill-card),
  1px `--border`, no heavy shadow (`0 1px 3px rgba(0,0,0,0.04)` max).
- Card header: small mono uppercase title + muted sans subtitle.

### Summary Card (Req 2)
- Hero metric in mono, bold, on a `--surface-muted` highlight block.
- Day change as a small pill badge: green/red background tint, direction icon.
- Zero day-change = neutral gray pill (never styled green or red).

### Holdings Table (Req 3, 9)
- Sans-serif data, right-aligned numeric columns, sortable column headers (mono,
  small up/down caret on active sort).
- Row click opens Detail View (drawer or modal) — reuse card styling.
- Empty state: centered muted mono message ("NO HOLDINGS TO DISPLAY").

### Line Chart (Req 4, 6)
- Thin blue line, pale blue area fill beneath.
- Date-range pills (`1D 1M YTD 1Y All`) top-right of card: active = solid blue,
  inactive = `--surface-muted` with `--text-secondary`. Sharp-cornered segmented
  control (4–8px radius), not a fully rounded pill group.

### Allocation Donut (Req 5)
- One segment per asset class, blue as the dominant/primary category color with
  muted gray-blue tints for the rest (avoid introducing new hues per segment —
  stay inside the blue/neutral palette plus one warm neutral if a 4th tone is
  truly needed).
- Legend: mono labels + sans percentage values.

### Top Movers (Req 10)
- Two-column gainers/losers list, ticker in mono, % in sans, green/red direction.

### Buttons
- Primary: solid blue, white mono uppercase text, `--radius-control` (sharp, like
  the Electric Mind "TALK TO US" button) — **not** a rounded pill.
- Secondary: white, 1px border, dark text.

---

## 5. Explicit decisions / changes from the two source drafts

1. **Dark mode dropped entirely** — the Obsidian theme (`#0B0F19` background,
   glow effects) from `design/README.md` is replaced with the light theme above.
2. **Green brand accent dropped** — `frontend/UI resoruces/design - Diya .md`'s
   emerald-green accent is replaced with Electric Mind blue. Green is kept
   *only* as the financial "gain" color, not as brand/navigation color.
3. **Pill-everything shape language softened** — Electric Mind's reference uses
   sharp rectangular nav/buttons, so card and control radii are reduced from the
   24–28px pill style down to 8–12px, except small status badges which stay pill.
4. **Monospace headings added** — not present in either source draft; pulled from
   the Electric Mind homepage reference to make the dashboard brand-recognizable.
5. **Layout/requirements-mapping kept** from `design/README.md` since it already
   maps 1:1 to the ten tasks in `frontend/REQUIREMENTS.md` — this part wasn't
   theme-dependent and didn't need to change.
