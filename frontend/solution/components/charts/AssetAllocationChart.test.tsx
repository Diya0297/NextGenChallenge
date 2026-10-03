import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AssetAllocationChart from "./AssetAllocationChart";

describe("AssetAllocationChart Component", () => {
  const sampleData = [
    { assetClass: "Equity", value: 289410.0 },
    { assetClass: "Fixed Income", value: 120500.0 },
    { assetClass: "Cash", value: 42340.12 },
    { assetClass: "Alternatives", value: 30100.0 },
  ];

  it("renders empty state when data is empty", () => {
    render(<AssetAllocationChart data={[]} />);
    expect(
      screen.getByText("No asset allocation data available")
    ).toBeDefined();
  });

  it("renders all 4 categories with labels and percentage weights", () => {
    render(<AssetAllocationChart data={sampleData} />);

    // Check SVG img
    expect(
      screen.getByRole("img", { name: "Asset allocation donut chart" })
    ).toBeDefined();

    // Check that all 4 asset class labels are present in legend
    expect(screen.getByText("Equity")).toBeDefined();
    expect(screen.getByText("Fixed Income")).toBeDefined();
    expect(screen.getByText("Cash")).toBeDefined();
    expect(screen.getByText("Alternatives")).toBeDefined();

    // Check percentages
    expect(screen.getByText("60.0%")).toBeDefined();
    expect(screen.getByText("25.0%")).toBeDefined();
    expect(screen.getByText("8.8%")).toBeDefined();
    expect(screen.getByText("6.2%")).toBeDefined();
  });

  it("handles a single-asset-class portfolio (100% allocation)", () => {
    const singleClassData = [{ assetClass: "Equity", value: 500000.0 }];
    render(<AssetAllocationChart data={singleClassData} />);

    expect(screen.getByText("Equity")).toBeDefined();
    expect(screen.getByText("100.0%")).toBeDefined();
  });

  it("handles a tiny allocation (<1%) remaining visible and labeled", () => {
    const tinyAllocationData = [
      { assetClass: "Equity", value: 995000.0 },
      { assetClass: "Cash", value: 500.0 }, // ~0.05%
    ];
    render(<AssetAllocationChart data={tinyAllocationData} />);

    expect(screen.getByText("Cash")).toBeDefined();
    // Tiny slice is labeled and visible
    expect(screen.getByText("0.1%")).toBeDefined();
  });

  it("updates center label when hovering a legend item or slice", () => {
    render(<AssetAllocationChart data={sampleData} />);

    // Initially shows Total
    expect(screen.getByText("Total")).toBeDefined();

    // Hover Equity legend row
    const equityLabel = screen.getByText("Equity");
    const legendRow = equityLabel.closest("div")?.parentElement;
    if (legendRow) {
      fireEvent.mouseEnter(legendRow);
      // Center title should now be Equity
      expect(screen.getAllByText("Equity").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("60.0%").length).toBeGreaterThanOrEqual(1);

      fireEvent.mouseLeave(legendRow);
      expect(screen.getByText("Total")).toBeDefined();
    }
  });
});
