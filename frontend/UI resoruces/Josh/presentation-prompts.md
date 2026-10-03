# Presentation prompts for Claude in PowerPoint

Send **Prompt 0 first**, then one prompt per slide, in order. Replace anything in [square brackets] before sending.

---

## Prompt 0: Context (send first)

> I'm making a short demo presentation for a team project, built during Electric Mind's Next Gen Assessment Day. Three of us ([Josh], [Marco], [Diya]) built the frontend of a **wealth management portfolio dashboard** in one day, using Next.js, React and TypeScript, with full AI assistance. The audience is Electric Mind interviewers, who care about how we think, work together and explain our decisions, more than about finishing everything.
>
> **Style for every slide:** dark theme to match our app. Background #0B0F19, card panels #151E2E with 12px rounded corners and a subtle light border, main text #F1F5F9, secondary text #94A3B8, green #10B981 for positive things, red #EF4444 for problems, sky blue #38BDF8 for highlights. Font: Inter (or a clean sans-serif). Keep each slide to **at most 4 short bullets or one visual**, with plenty of space. Use "we" language. Add **speaker notes** to every slide (3–5 sentences, conversational) so whoever presents knows what to say. Don't invent features, numbers or results I haven't given you.

---

## Slide 1: Title

> Create a title slide. Title: "Portfolio Dashboard". Subtitle: "Helping clients understand what they own, what it's worth, and how it's changed". Below that, small text: "Frontend track · [Josh], [Marco], [Diya] · Electric Mind Next Gen Assessment Day". Add a subtle decorative line chart shape in sky blue (#38BDF8) along the bottom, fading out. Speaker notes: a one-sentence welcome and introduce the three of us by name.

## Slide 2: The challenge

> Create a slide titled "The challenge". Left side: one sentence: "Build a dashboard for a wealth management client, from scratch, in one day." Right side: a grid of 10 small numbered cards, one per task: 1 App shell, 2 Summary card, 3 Holdings table, 4 Value chart, 5 Allocation chart, 6 Date range, 7 CAD/USD toggle, 8 Account selector, 9 Holding detail, 10 Top movers. Under the grid, in muted text: "We were told: fewer tasks done well beats all tasks done badly." Speaker notes: explain we got a written brief and a mock API with fake data, and that we chose quality over quantity.

## Slide 3: How we split the work

> Create a slide titled "How we split the work". Show three columns, one per person, each in a card:
> - **[Josh]: Foundation + money.** App shell (1), shared data layer, Summary card (2), CAD/USD toggle (7)
> - **[Marco]: Charts.** Value chart (4), Allocation chart (5), Date range (6), Account selector (8)
> - **[Diya]: Holdings.** Holdings table (3), Holding detail (9), Top movers (10). Also wrote our task-split plan.
>
> Under the columns, one line: "Each person owns their own folder, so we could build in parallel without overwriting each other." Speaker notes: explain that the split was planned up front in a shared to-do file, and the foundation was built first because everyone depended on it.

## Slide 4: How we worked together

> Create a slide titled "How we worked together" as a horizontal timeline with 4 steps, each a small card with an icon:
> 1. "Agree first": read the brief together, split tasks, agree the design
> 2. "Foundation first": shared layout, data and formatting pushed to main early
> 3. "Build in parallel": own branch, own folder, small commits pushed often
> 4. "Merge and check": combine everyone's work and test it together
>
> Speaker notes: explain that getting the shared foundation onto main early meant nobody had to wait or guess, and that small commits made problems easy to trace.

## Slide 5: Design decisions

> Create a slide titled "Design: three drafts, one decision". Left: three small labelled boxes in a row showing the drafts we considered: "Dark mockup", "Green light theme", "Electric Mind–style light theme", with a green tick on "Dark mockup" and an arrow to the right. Right, three bullets:
> - Dark theme, with green and red reserved for gains and losses
> - Numbers line up in columns (tabular figures), which matters for financial data
> - Where the mockup disagreed with the brief, we followed the brief (e.g. Top Movers in %, not $)
>
> Small muted footnote: "We didn't copy Electric Mind's own fonts because they're licensed, so we used Inter." Speaker notes: explain that we compared drafts as a team and agreed on one so all three parts would match, and why the brief is the source of truth.

## Slide 6: Architecture: one source of truth

> Create a slide titled "One source of truth". Draw a simple diagram: on the left, a box "Mock API" with three small labels (accounts, portfolio, exchange rate). An arrow goes to a central highlighted box "DashboardProvider (shared state)" listing: selected account, portfolio data, currency + money converter, date range. Arrows go out to five boxes on the right: "Summary card", "Value chart", "Allocation chart", "Holdings table", "Top movers". Under the diagram, one line: "Data is loaded once per account and shared, so every card shows the same account at the same moment." Speaker notes: explain that one shared place for data and settings means switching account or currency updates everything together, and the API isn't called five times.

## Slide 7: Live demo

> Create a simple transition slide titled "Live demo" with a large outline of a browser window in the centre showing the text "localhost:3000". Below it, a short checklist in small text: "Summary → charts → date range → switch account → switch to USD → edge cases". Speaker notes: "We'll now show the dashboard running." Then list the order to click through, and mention that adding ?scenario=negative to the address shows losses, ?scenario=zero shows no change, and ?fail=true shows our error handling.

## Slide 8: Summary card (Task 2)

> Create a slide titled "Summary card: honest at a glance". Left: a mock-up of a dark card showing "$65,680.00 · Total Market Value", "+$397.25 (+0.61%)" in green with an up arrow, and "+18.7% · Total Return". Right, three small variants stacked: green "+$397.25 ▲" labelled "Gain", red "-$1,340.41 ▼" labelled "Loss", grey "$0.00 —" labelled "No change". Bullets under them:
> - Zero is grey: no change is neither good nor bad
> - Arrows and +/- signs as well as colour, for colour-blind users
> - Very large numbers stay readable
>
> Speaker notes: explain that the API uses two different percentage formats (2.4 means 2.4%, but 0.187 means 18.7%), so we made a named helper for each to avoid mixing them up.

## Slide 9: CAD ↔ USD toggle (Task 7)

> Create a slide titled "Currency: one converter for everything". Top: a pill-shaped toggle graphic "CAD | USD" with the text "1 CAD = 0.73 USD" beside it. Middle: "$65,680.00" → arrow → "US$47,946.40", with "+0.61%" unchanged underneath and the note "percentages don't change". Bottom, three bullets:
> - Every dollar value goes through one shared converter, so nothing gets missed
> - Convert first, round last, so totals always match
> - If the rate can't load, USD is disabled rather than showing wrong numbers
>
> Speaker notes: mention that a teacher suggested always showing the current rate, so we added it next to the switch, and that switching doesn't reload data or reset the sort, date range or account.

## Slide 10: Charts and date range (Tasks 4, 5, 6)

> Create a slide titled "Charts: built from scratch". Left: a simple sky-blue line chart with a soft gradient under it, a tooltip bubble showing a date and value, and five small pill buttons above it: 1D, 1M, YTD, 1Y, All (with 1Y highlighted). Right: a donut chart with four segments and a legend. Bullets:
> - Custom SVG charts, with no chart library needed
> - Hover shows the exact date and value
> - YTD starts from 1 January; short histories show what's available
> - Tiny slices (<1%) stay visible; a single asset class still draws a full ring
>
> Speaker notes: [Marco] explains why he built the charts in SVG and how gaps in the data are handled.

## Slide 11: Account selector (Task 8)

> Create a slide titled "Switching accounts". Show a dropdown graphic opened with two options: "Taxable Brokerage · P-9001" and "Retirement Account · P-9002", with the first one highlighted. To the right, an arrow pointing to three small labels: "Summary", "Charts", "Holdings", with the caption "all update together, with no page reload". Speaker notes: [Marco] explains how the selected account is shared, and that a client with only one account still sees a working selector.

## Slide 12: Holdings, detail view and top movers (Tasks 3, 9, 10)

> Create a slide titled "Holdings: from overview to detail". Left: a small table mock-up with columns Ticker, Market Value, Weight %, Gain/Loss, with sort arrows on the headers and green/red gain/loss values. Middle: an arrow labelled "click a row" pointing to a side panel showing "Cost basis · Purchase date · Sector · 52-week range · Price history". Right: a "Top Movers" card with "Gainers" and "Losers" lists showing ticker and %. Speaker notes: [Diya] explains [what was finished, how sorting works, and how empty data or missing dividend yield is handled. Update this to match what was actually built].

## Slide 13: Testing and quality

> Create a slide titled "How we know it works". Left: a large number "63" in green with the label "automated tests, all passing". Right, a short list of what the tests check: "The brief's exact sample data", "Gains, losses and zero", "Loading and error states", "Currency conversion and rounding", "Sorting, date ranges and chart edge cases". Bottom strip, in muted text: "Edge cases can also be shown live: ?scenario=empty · negative · zero · large · gaps · fail=true". Speaker notes: explain that tests use fake data so they run without a server, and that the mock's scenarios let us show any edge case in the browser during the demo.

## Slide 14: Challenges and what we learned

> Create a slide titled "What was hard, and what we learned". Three cards side by side, each with a short problem in red and a lesson in green:
> 1. Problem: "Design changed several times". Lesson: "Agree the design before building, and keep one source of truth."
> 2. Problem: "The mockup contradicted the brief". Lesson: "The requirements are the spec; check designs against them."
> 3. Problem: "When we merged, two parts tracked the selected account separately". Lesson: "Agree shared state up front, and merge early to catch it."
>
> Speaker notes: be honest about each one, explain how we resolved it, and say what we'd do differently next time.

## Slide 15: Assumptions and open questions

> Create a slide titled "Assumptions we made". Four short bullets with a small info icon each:
> - All API money values are in CAD
> - The mock's fixed rate (0.73) is used for all conversions
> - Today's rate is applied to past chart values; a real product might use historical rates
> - The first account is shown until another is chosen
>
> Speaker notes: explain that the brief said to document assumptions, and that the historical-rate question is one we'd want to check with a real client team.

## Slide 16: What we'd do next

> Create a slide titled "With more time". A simple list of 4–5 items, each with an arrow icon:
> - [Finish any unfinished tasks]
> - Show when data was last updated ("as of" time)
> - Remember the client's currency choice between visits
> - Browser-level end-to-end tests across the whole page
> - Connect to a real backend in place of the mock
>
> Speaker notes: explain the priorities briefly.

## Slide 17: Thank you / questions

> Create a closing slide. Large text: "Thank you". Smaller text below: "Questions?". At the bottom, the three names: [Josh] · [Marco] · [Diya], and the project link [GitHub link]. Use the same subtle sky-blue line chart decoration as the title slide. Speaker notes: thank the interviewers and invite questions.
