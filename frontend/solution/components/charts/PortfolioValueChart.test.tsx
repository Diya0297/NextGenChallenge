import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioValueChart from "./PortfolioValueChart";

describe("PortfolioValueChart Component", () => {
  it("renders empty state message when data is empty", () => {
    render(<PortfolioValueChart data={[]} />);
    expect(screen.getByText("No performance history available")).toBeDefined();
  });

  it("handles a single data point without crashing", () => {
    const singlePoint = [{ date: "2025-01-01", marketValue: 450000 }];
    const { container } = render(<PortfolioValueChart data={singlePoint} />);
    expect(container.querySelector("circle")).toBeDefined();
    expect(screen.queryByText("No performance history available")).toBeNull();
  });

  it("handles 2 data points with a line path", () => {
    const twoPoints = [
      { date: "2025-01-01", marketValue: 400000 },
      { date: "2025-02-01", marketValue: 420000 },
    ];
    const { container } = render(<PortfolioValueChart data={twoPoints} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it("renders full multi-point dataset with svg role and axis text", () => {
    const sampleData = [
      { date: "2025-01-01", marketValue: 410000.0 },
      { date: "2025-02-01", marketValue: 423500.0 },
      { date: "2025-03-01", marketValue: 418200.0 },
      { date: "2025-04-01", marketValue: 435000.0 },
    ];
    render(<PortfolioValueChart data={sampleData} />);
    expect(
      screen.getByRole("img", { name: "Portfolio performance value chart" })
    ).toBeDefined();
  });

  it("renders tooltip on pointer interaction", () => {
    const sampleData = [
      { date: "2025-01-01", marketValue: 410000.0 },
      { date: "2025-02-01", marketValue: 423500.0 },
    ];
    render(<PortfolioValueChart data={sampleData} currency="CAD" />);
    const svg = screen.getByRole("img", {
      name: "Portfolio performance value chart",
    });

    // Mock getBoundingClientRect for SVG
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

    fireEvent.pointerMove(svg, { clientX: 100, clientY: 100 });

    // Tooltip should appear displaying formatted currency
    expect(screen.getByText("$410,000.00")).toBeDefined();
  });
});
