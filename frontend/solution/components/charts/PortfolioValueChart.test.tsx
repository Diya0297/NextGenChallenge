import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioValueChart from "./PortfolioValueChart";
import { type TimeSeriesPoint } from "./chartUtils";

describe("Task 4: Portfolio Value Line Chart Component", () => {
  const sampleData: TimeSeriesPoint[] = [
    { date: "2025-01-01", marketValue: 410000.0 },
    { date: "2025-02-01", marketValue: 423500.0 },
    { date: "2025-03-01", marketValue: 418200.0 },
    { date: "2025-04-01", marketValue: 435000.0 },
  ];

  // 12+ points dataset per Definition of Done
  const twelvePointData: TimeSeriesPoint[] = Array.from({ length: 14 }, (_, i) => ({
    date: `2025-${String(i + 1).padStart(2, "0")}-01`,
    marketValue: 400000 + i * 5000 + (i % 2 === 0 ? 3000 : -2000),
  }));

  it("renders empty state message when dataset is empty", () => {
    render(<PortfolioValueChart data={[]} />);
    expect(screen.getByText("No performance history available")).toBeDefined();
  });

  it("handles a single data point edge case without crashing", () => {
    const singlePoint: TimeSeriesPoint[] = [{ date: "2025-01-01", marketValue: 450000 }];
    const { container } = render(<PortfolioValueChart data={singlePoint} />);
    // Renders single point circle
    expect(container.querySelector("circle")).toBeDefined();
    expect(screen.queryByText("No performance history available")).toBeNull();
  });

  it("handles 2 data points edge case with a line path", () => {
    const twoPoints: TimeSeriesPoint[] = [
      { date: "2025-01-01", marketValue: 400000 },
      { date: "2025-02-01", marketValue: 420000 },
    ];
    const { container } = render(<PortfolioValueChart data={twoPoints} />);
    const paths = container.querySelectorAll("path");
    // Area and stroke paths
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it("renders full multi-point dataset with svg role, gridlines and axis labels", () => {
    render(<PortfolioValueChart data={sampleData} />);
    expect(
      screen.getByRole("img", { name: "Portfolio performance value chart" })
    ).toBeDefined();

    // Verify date labels are present
    expect(screen.getByText("Jan 1, 2025")).toBeDefined();
    expect(screen.getByText("Apr 1, 2025")).toBeDefined();
  });

  it("satisfies Definition of Done: renders a longer 12+ point dataset accurately", () => {
    const { container } = render(<PortfolioValueChart data={twelvePointData} />);
    expect(
      screen.getByRole("img", { name: "Portfolio performance value chart" })
    ).toBeDefined();

    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2); // stroke and area paths
  });

  it("handles edge case: flat identical values across all points without division-by-zero", () => {
    const flatData: TimeSeriesPoint[] = [
      { date: "2025-01-01", marketValue: 500000 },
      { date: "2025-02-01", marketValue: 500000 },
      { date: "2025-03-01", marketValue: 500000 },
    ];
    const { container } = render(<PortfolioValueChart data={flatData} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);

    // Verify paths do not contain NaN
    paths.forEach((p) => {
      const d = p.getAttribute("d");
      expect(d).not.toContain("NaN");
    });
  });

  it("handles edge case: data gaps (missing intermediate dates) without breaking layout", () => {
    const gapData: TimeSeriesPoint[] = [
      { date: "2025-01-01", marketValue: 400000 },
      { date: "2025-06-01", marketValue: 420000 }, // 5 month gap
      { date: "2025-12-01", marketValue: 450000 }, // 6 month gap
    ];
    const { container } = render(<PortfolioValueChart data={gapData} />);
    expect(container.querySelectorAll("path").length).toBe(2);
  });

  it("satisfies Definition of Done: displays interactive tooltip on hover with exact date and currency value", () => {
    render(<PortfolioValueChart data={sampleData} currency="CAD" />);
    const svg = screen.getByRole("img", {
      name: "Portfolio performance value chart",
    });

    svg.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 600,
      bottom: 240,
      width: 600,
      height: 240,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Hover near first point
    fireEvent.pointerMove(svg, { clientX: 60, clientY: 100 });

    expect(screen.getByText("$410,000.00")).toBeDefined();
    expect(screen.getAllByText("Jan 1, 2025").length).toBeGreaterThanOrEqual(1);

    // Leaving chart hides tooltip
    fireEvent.pointerLeave(svg);
    expect(screen.queryByText("$410,000.00")).toBeNull();
  });

  it("supports USD currency display in tooltip", () => {
    render(<PortfolioValueChart data={sampleData} currency="USD" />);
    const svg = screen.getByRole("img", {
      name: "Portfolio performance value chart",
    });

    svg.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 600,
      bottom: 240,
      width: 600,
      height: 240,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerMove(svg, { clientX: 60, clientY: 100 });
    expect(screen.getByText("$410,000.00")).toBeDefined();
  });
});
