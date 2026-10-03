# Dashboard UI Design Reference

> This document describes the visual design language, layout,
> components, spacing, and interaction patterns shown in the reference
> image. Use it as a UI direction guide rather than copying the
> financial content literally.

## Visual Reference

![Dashboard UI reference](dashboard-ui-reference.png)

------------------------------------------------------------------------

## 1. Overall Design Direction

The interface uses a **modern, minimal SaaS dashboard** style with a
very light neutral background, white cards, large rounded corners,
subtle borders/shadows, and a single green accent color.

The design should feel:

-   Clean and premium
-   Spacious rather than dense
-   Modern and polished
-   Friendly, but still professional
-   Soft and lightweight
-   Easy to scan
-   Consistent across cards, navigation, tables, charts, and controls

Avoid heavy borders, harsh shadows, strong gradients, excessive colors,
or crowded layouts.

------------------------------------------------------------------------

## 2. Color System

### Background

-   Main application background: very light warm gray / off-white
-   Primary cards and surfaces: white
-   Secondary controls: very light gray

### Primary Accent

Use a rich emerald/forest green as the main accent.

Approximate visual direction: - Primary green: `#0A8F5A` to `#14945F` -
Dark green text/accent: `#087348` - Soft mint green: `#A9D8C4` - Very
pale green: `#EAF6F0`

Use green for: - Active navigation states - Primary buttons - Important
chart bars - Positive status indicators - Small badges - Selected
toggles - Brand iconography

### Text

-   Primary text: near black / charcoal
-   Secondary text: medium gray
-   Muted labels: light gray
-   Positive metrics: green

Do not use pure black everywhere. Most supporting text should have
reduced contrast.

------------------------------------------------------------------------

## 3. Typography

Use a clean modern sans-serif font.

Suggested options: - Inter - Geist - SF Pro - Manrope

### Hierarchy

**Page greeting / hero heading** - Large, approximately 32--38 px -
Medium or semibold weight - First part dark - User/name portion may use
a lighter gray weight/color

**Card values / key metrics** - Approximately 26--36 px - Medium or
semibold - Strong visual emphasis

**Card titles** - Approximately 13--16 px - Medium or semibold

**Body / navigation** - Approximately 12--14 px - Regular or medium

**Helper text** - Approximately 10--12 px - Muted gray

Use generous line-height and avoid overly bold typography.

------------------------------------------------------------------------

## 4. Main Page Structure

The page uses three major areas:

1.  Top navigation bar
2.  Left vertical utility navigation
3.  Main dashboard content grid

The dashboard should sit inside a spacious desktop canvas with
consistent outer margins.

### Recommended layout

``` text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Logo                 Main Navigation                    Search Bell Profile │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Left Rail   Welcome Back, User                 Date Range     Primary Action│
│                                                                             │
│             ┌────────────┐ ┌───────────────────────┐ ┌───────────────────┐ │
│             │ Summary    │ │ Main Analytics Chart  │ │ Balance / Trend   │ │
│             │ Card       │ │                       │ │ Card              │ │
│             ├────────────┤ └───────────────────────┘ ├───────────────────┤ │
│             │ Small KPI  │                           │ Secondary Metric  │ │
│             └────────────┘ ┌───────────────────────┐ │ Card              │ │
│                            │ History / Data Table   │ │                   │ │
│                            │                       │ │                   │ │
│                            └───────────────────────┘ └───────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

The layout is asymmetrical but balanced. Larger analytical information
occupies the center while smaller summary cards sit on the sides.

------------------------------------------------------------------------

## 5. Top Navigation

The top navigation is contained inside a large white rounded bar.

### Left

-   Brand icon
-   Brand/product name
-   Green branding

### Center

A pill-shaped navigation group containing items such as: - Dashboard -
Reports - Documents - History - Contacts

The active page appears inside a slightly brighter/raised pill.

### Right

Use compact circular controls for: - Search - Notifications - User
avatar - Small dropdown chevron

### Styling

-   White background
-   Large pill-shaped outer container
-   Very soft border/shadow
-   Generous horizontal padding
-   Controls aligned vertically
-   No heavy separators

------------------------------------------------------------------------

## 6. Left Sidebar / Utility Rail

The sidebar is a narrow floating vertical rail rather than a full-height
solid sidebar.

### Structure

Use separate rounded white pill containers for groups of icons.

Example: - Main navigation group - Secondary utility group -
Settings/logout group near the bottom

### Active state

The selected icon appears inside a filled green circle or rounded square
with a white icon.

### Inactive state

-   Dark gray outline icons
-   No filled background
-   Plenty of whitespace

The sidebar should visually float over the page background.

------------------------------------------------------------------------

## 7. Page Header

Below the navigation, show a large welcome heading on the left.

Example visual pattern:

`Welcome Back,` **`User`**

The first phrase should be dark while the user's name can be lighter
gray.

On the right, align: - Date-range picker - Primary action button

### Date Picker

-   White pill-shaped control
-   Calendar icon
-   Compact text
-   Dropdown chevron

### Primary Action

-   White pill button
-   Plus icon
-   Dark text
-   Soft border/shadow

The controls should feel lightweight instead of looking like heavy form
inputs.

------------------------------------------------------------------------

## 8. Card Design System

Cards are the core visual building block.

### Card appearance

-   White background
-   Border radius: approximately 20--28 px
-   Thin light-gray border or extremely subtle shadow
-   Generous internal padding
-   Clear spacing between cards

### Card header pattern

Most cards use: - Small icon inside a pale circular/square container -
Title - Muted subtitle - Optional action icon in top-right

### Expand/Open action

Use a small circular light-gray button with a diagonal arrow icon.

### Important

Avoid rectangular cards with sharp corners. The rounded card language
should be used consistently throughout the dashboard.

------------------------------------------------------------------------

## 9. KPI / Summary Cards

Small KPI cards should contain: - Short label - Large numeric value -
Optional positive/negative percentage badge

Percentage badges should be compact pills.

Positive example: - Pale or medium green background - Green or white
text depending on contrast - Small percentage value

Keep these cards simple with only one primary metric.

------------------------------------------------------------------------

## 10. Feature Card / Account Card

The reference includes a prominent green card nested inside a larger
white card.

Use this pattern when one object needs extra emphasis.

### Styling

-   Saturated green background
-   Large rounded corners
-   White text
-   Small supporting labels
-   Strong main value
-   Small icon/details aligned around edges

This creates visual contrast without introducing another accent color.

------------------------------------------------------------------------

## 11. Analytics Chart

The main analytics card is large and centered.

### Chart style

-   Rounded vertical bars
-   Muted mint bars for normal periods
-   Dark green bar for the highlighted/selected period
-   Very light dotted or dashed horizontal grid lines
-   Minimal axis labels
-   No heavy chart border

### Selected data point

Show a small floating green value pill above the highlighted bar with a
dot/marker connecting it to the bar.

### Toggle

Place a segmented pill control near the top-right of the chart.

Example: - Monthly - Annually

Selected option: - Green fill - White text

Inactive option: - Very light gray background - Gray text

------------------------------------------------------------------------

## 12. Trend / Line Chart Card

Use a lightweight area/line chart for balance or trend information.

### Appearance

-   Thin green line
-   Very pale green area fill beneath the line
-   Minimal or hidden axes
-   Very light horizontal guide lines
-   No visual clutter

The metric should remain more visually important than the graph itself.

### Bottom actions

Pill buttons may overlap or sit near the lower portion of the chart: -
Primary action in green - Secondary action in white/light gray

------------------------------------------------------------------------

## 13. Data Table / History Section

The table is contained inside a large rounded white card.

### Header

-   Section title
-   Small muted description
-   Optional open/expand action on the right

### Table

Columns may include: - Name - Date - Time - Status - Amount

### Row style

-   Spacious row height
-   Minimal dividers
-   Small logo/avatar at the beginning
-   Main label plus smaller green supporting metric
-   Status shown with a small green dot and soft pill
-   Numeric values aligned consistently

Do not use heavy table borders.

------------------------------------------------------------------------

## 14. Avatars and People

For people-related information: - Use small circular avatars - Allow
slight overlap for groups - Add a final green `+N` circle when more
people exist than can be displayed

This keeps people information compact and visual.

------------------------------------------------------------------------

## 15. Iconography

Use simple rounded outline icons.

Suggested libraries: - Lucide - Heroicons - Phosphor Icons

Icon style should be: - Thin to medium stroke - Minimal - Consistent
stroke width - Mostly monochrome - Green only for active or emphasized
states

Avoid mixing multiple icon styles.

------------------------------------------------------------------------

## 16. Shape Language

The design relies heavily on soft geometry.

Use: - Large rounded cards - Pill-shaped buttons - Circular icon
buttons - Rounded segmented controls - Rounded chart bars - Circular
avatars

Recommended border radii: - Main cards: `20px–28px` - Small
cards/controls: `14px–20px` - Pills: `999px` - Circular controls: `50%`

------------------------------------------------------------------------

## 17. Spacing

The interface should feel open.

Suggested spacing system: - 4 px base grid - 8 px between tightly
related elements - 12--16 px for small component gaps - 20--24 px card
padding - 24--32 px between major cards/sections - 32--48 px around
large page sections

Do not compress the dashboard just to fit more content.

------------------------------------------------------------------------

## 18. Borders and Shadows

Keep elevation extremely subtle.

Suggested approach:

``` css
border: 1px solid rgba(0, 0, 0, 0.04);
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.025);
```

For floating navigation or important controls, slightly stronger shadows
are acceptable, but they should remain soft.

Avoid dark drop shadows.

------------------------------------------------------------------------

## 19. Interaction and Motion

Animations should be subtle and smooth.

Recommended: - 150--250 ms transitions - Slight hover lift on cards -
Soft background change on icon buttons - Smooth segmented-control
movement - Animated chart transitions - Small scale or shadow change on
primary buttons - Gentle dropdown/fade animations

Avoid flashy movement, bouncing, or excessive effects.

------------------------------------------------------------------------

## 20. Responsive Behaviour

### Desktop

Preserve the multi-column dashboard structure.

### Tablet

-   Reduce outer margins
-   Move right-side cards below main analytics when necessary
-   Keep navigation compact

### Mobile

-   Collapse top navigation into a menu
-   Convert left utility rail into bottom navigation or a drawer
-   Stack all cards vertically
-   Allow tables to scroll horizontally or convert rows into cards
-   Keep primary metrics visible near the top

------------------------------------------------------------------------

## 21. Design Rules for AI Implementation

When generating or updating the UI:

1.  Follow the reference image for **visual language, spacing,
    proportions, rounded shapes, card hierarchy, and overall polish**.
2.  Do not copy the financial dashboard content unless the application
    actually needs financial information.
3.  Adapt the card structure to the application's real content and
    workflows.
4.  Maintain one dominant green accent color.
5.  Keep the main background light and neutral.
6.  Use white floating surfaces instead of boxed gray sections.
7.  Use large rounded corners consistently.
8.  Keep borders and shadows subtle.
9.  Maintain generous whitespace.
10. Prioritize clear visual hierarchy over displaying more information.
11. Keep icons simple and consistent.
12. Use pills for filters, statuses, toggles, and compact actions.
13. Use charts only where they communicate useful information.
14. Keep animations smooth, restrained, and professional.
15. The final UI should feel like a polished modern SaaS product, not a
    generic admin template.

------------------------------------------------------------------------

## 22. Quick Visual Tokens

``` css
:root {
  --background: #F5F6F4;
  --surface: #FFFFFF;

  --primary: #0A8F5A;
  --primary-dark: #087348;
  --primary-soft: #A9D8C4;
  --primary-subtle: #EAF6F0;

  --text-primary: #171917;
  --text-secondary: #6F746F;
  --text-muted: #A1A6A1;

  --border: rgba(0, 0, 0, 0.05);

  --radius-card: 24px;
  --radius-control: 16px;
  --radius-pill: 999px;

  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

These values are approximate design tokens derived visually from the
reference and can be adjusted slightly during implementation.
