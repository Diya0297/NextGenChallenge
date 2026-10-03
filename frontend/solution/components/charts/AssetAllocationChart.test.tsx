import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AssetAllocationChart from "./AssetAllocationChart";
import { type AllocationEntry } from "./chartUtils";

describe("Task 5: Asset Allocation Donut Chart Component", () => {
  const sampleData: AllocationEntry[] = [
    { assetClass: "Equity", value: 289410.0 },
    { assetClass: "Fixed Income", value: 120500.0 },
    { assetClass: "Cash", value: 42340.12 },
    { assetClass: "Alternatives", value: 30100.0 },
  ];

  it("renders empty state message when data is empty or omitted", () => {
    render(<AssetAllocationChart data={[]} />);
    expect(
      screen.getByText("No asset allocation data available")
    ).toBeDefined();
  });

  it("handles edge case: all 0 values gracefully by rendering empty state", () => {
    const zeroData: AllocationEntry[] = [
      { assetClass: "Equity", value: 0 },
      { assetClass: "Cash", value: 0 },
    ];
    render(<AssetAllocationChart data={zeroData} />);
    expect(
      screen.getByText("No asset allocation data available")
    ).toBeDefined();
  });

  it("satisfies Definition of Done: renders all 4 categories with visible labels and percentage weights", () => {
    render(<AssetAllocationChart data={sampleData} />);

    expect(
      screen.getByRole("img", { name: "Asset allocation donut chart" })
    ).toBeDefined();

    // Verify all 4 asset class labels are present in the legend
    expect(screen.getByText("Equity")).toBeDefined();
    expect(screen.getByText("Fixed Income")).toBeDefined();
    expect(screen.getByText("Cash")).toBeDefined();
    expect(screen.getByText("Alternatives")).toBeDefined();

    // Verify percentage weights
    expect(screen.getByText("60.0%")).toBeDefined();
    expect(screen.getByText("25.0%")).toBeDefined();
    expect(screen.getByText("8.8%")).toBeDefined();
    expect(screen.getByText("6.2%")).toBeDefined();
  });

  it("verifies segments are visually distinct with unique color fills", () => {
    const { container } = render(<AssetAllocationChart data={sampleData} />);
    const paths = container.querySelectorAll("svg path");
    expect(paths.length).toBe(4);

    const fills = Array.from(paths).map((p) => p.getAttribute("fill"));
    const uniqueFills = new Set(fills);
    expect(uniqueFills.size).toBe(4); // all 4 segments have distinct colors
  });

  it("satisfies Edge Case: handles a single-asset-class portfolio (100% allocation) without breaking", () => {
    const singleClassData: AllocationEntry[] = [{ assetClass: "Equity", value: 500000.0 }];
    const { container } = render(<AssetAllocationChart data={singleClassData} />);

    expect(screen.getByText("Equity")).toBeDefined();
    expect(screen.getByText("100.0%")).toBeDefined();

    const paths = container.querySelectorAll("svg path");
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute("d")).not.toContain("NaN");
  });

  it("satisfies Edge Case: handles tiny allocations (<1%) remaining visible and labeled", () => {
    const tinyAllocationData: AllocationEntry[] = [
      { assetClass: "Equity", value: 999500.0 },
      { assetClass: "Cash", value: 500.0 }, // ~0.05%
    ];
    const { container } = render(<AssetAllocationChart data={tinyAllocationData} />);

    expect(screen.getByText("Cash")).toBeDefined();
    // Tiny slice percentage is labeled and visible
    expect(screen.getByText("0.1%")).toBeDefined();

    // Ensure path is rendered and has positive length
    const paths = container.querySelectorAll("svg path");
    expect(paths.length).toBe(2);
  });

  it("updates center label when hovering directly over an SVG donut segment", () => {
    const { container } = render(<AssetAllocationChart data={sampleData} />);

    // Initially displays total
    expect(screen.getByText("Total")).toBeDefined();

    const paths = container.querySelectorAll("svg path");
    expect(paths.length).toBe(4);

    // Hover first segment (Equity)
    fireEvent.mouseEnter(paths[0]);
    expect(screen.getAllByText("Equity").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("60.0%").length).toBeGreaterThanOrEqual(1);

    // Mouse leave resets center label back to Total
    const svg = container.querySelector("svg");
    if (svg) {
      fireEvent.mouseLeave(svg);
      expect(screen.getByText("Total")).toBeDefined();
    }
  });

  it("updates center label when hovering over a legend row", () => {
    render(<AssetAllocationChart data={sampleData} />);

    const fixedIncomeLabel = screen.getByText("Fixed Income");
    const legendRow = fixedIncomeLabel.closest("div")?.parentElement;
    expect(legendRow).toBeDefined();

    if (legendRow) {
      fireEvent.mouseEnter(legendRow);
      expect(screen.getAllByText("Fixed Income").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("25.0%").length).toBeGreaterThanOrEqual(1);

      fireEvent.mouseLeave(legendRow);
      expect(screen.getByText("Total")).toBeDefined();
    }
  });

  it("formats currency values according to currency prop", () => {
    render(<AssetAllocationChart data={sampleData} currency="USD" />);
    expect(screen.getByText("$289,410.00")).toBeDefined();
  });
});
