---
name: finance-ui-design
description: >-
  Use this skill when designing or implementing UI/UX for finance-themed dashboards and web applications. It provides guidelines for color palettes, typography, data visualization, and layout.
---

# Finance UI/UX Design Guidelines

Use these guidelines when building finance-themed dashboards to ensure a premium, trustworthy, and highly readable user experience.

## 1. Color Palette & Aesthetics
- **Trust & Professionalism**: Rely on sleek dark modes or clean, high-contrast light modes.
- **Data Indicators**: Use distinct, universally understood colors for financial data:
  - **Positive values/Gains**: Use vibrant, accessible greens (e.g., `#10B981` or `hsl(160, 84%, 39%)`).
  - **Negative values/Losses**: Use clear reds (e.g., `#EF4444` or `hsl(0, 84%, 60%)`).
  - **Neutral values**: Use subdued grays or the default text color.
- **Premium Feel**: Avoid generic solid colors. Use subtle gradients for charts or primary buttons, and implement glassmorphism (translucency and background blur) sparingly for overlays or sticky headers.

## 2. Typography & Legibility
- **Fonts**: Use modern, clean sans-serif fonts such as Inter, Roboto, or Outfit.
- **Numbers**: Financial figures must be highly legible. 
  - Use monospaced or tabular figures for tables so numbers align vertically.
  - Always include thousands separators (e.g., `1,234,567.89`).
  - Differentiate hierarchy: Large, bold typography for summary figures (e.g., Total Balance), and smaller text for secondary info (e.g., percentage change).

## 3. Data Visualization & Charts
- **Clarity over Clutter**: Charts (Line, Donut, Bar) should not overwhelm the user. Use tooltips to reveal exact data points on hover rather than displaying all labels at once.
- **Interactive Elements**: Include micro-animations when hovering over chart segments, rows in a holdings table, or buttons. This makes the interface feel responsive and alive.
- **Empty States**: Always design graceful empty states for charts and tables when data is missing or zero.

## 4. Layout & Structure
- **Card-Based UI**: Group related information into distinct cards (e.g., "Portfolio Summary", "Top Movers", "Asset Allocation") with subtle shadows and rounded corners (e.g., `8px` or `12px` border radius).
- **Responsive Design**: Ensure tables and charts scale correctly. For large tables, use sticky headers and horizontal scrolling if necessary on smaller screens.
- **Hierarchy**: The most critical information (Total Portfolio Value) should be instantly visible at the top or top-left of the dashboard.

## Implementation Steps
When asked to build a UI component for a finance app:
1. Verify if the data involves positive/negative financial changes and apply the semantic colors.
2. Structure the data using standard formatting (currency symbols, decimal alignment).
3. Build the component using a card-based layout with modern typography.
4. Add hover effects and transitions for interactive elements.
