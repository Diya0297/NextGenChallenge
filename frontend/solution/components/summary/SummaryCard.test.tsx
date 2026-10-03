import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryCard from "./SummaryCard";

// The sample object from Task 2 in frontend/REQUIREMENTS.md
const briefSample = {
  totalMarketValue: 482350.12,
  dayChangeAmount: 1520.44,
  dayChangePercent: 0.32,
  totalReturnSinceInception: 0.187,
};

describe("SummaryCard", () => {
  it("renders the brief's sample data", () => {
    render(<SummaryCard summary={briefSample} currency="CAD" />);

    expect(screen.getByText("$482,350.12")).toBeDefined();
    expect(screen.getByTestId("day-change").textContent).toBe(
      "+$1,520.44 (+0.32%)",
    );
    expect(screen.getByTestId("total-return").textContent).toBe("+18.7%");
  });

  it("styles a gain as positive", () => {
    render(<SummaryCard summary={briefSample} currency="CAD" />);

    expect(screen.getByTestId("day-change").dataset.direction).toBe("positive");
  });

  it("styles a loss as negative", () => {
    render(
      <SummaryCard
        summary={{
          ...briefSample,
          dayChangeAmount: -1340.41,
          dayChangePercent: -2,
          totalReturnSinceInception: -0.087,
        }}
        currency="CAD"
      />,
    );

    expect(screen.getByTestId("day-change").textContent).toBe(
      "-$1,340.41 (-2.00%)",
    );
    expect(screen.getByTestId("day-change").dataset.direction).toBe("negative");
    expect(screen.getByTestId("total-return").dataset.direction).toBe("negative");
  });

  it("styles zero change as neutral, not positive or negative", () => {
    render(
      <SummaryCard
        summary={{
          ...briefSample,
          dayChangeAmount: 0,
          dayChangePercent: 0,
          totalReturnSinceInception: 0,
        }}
        currency="CAD"
      />,
    );

    expect(screen.getByTestId("day-change").dataset.direction).toBe("neutral");
    expect(screen.getByTestId("total-return").dataset.direction).toBe("neutral");
  });

  it("updates when the data changes", () => {
    const { rerender } = render(
      <SummaryCard summary={briefSample} currency="CAD" />,
    );

    rerender(
      <SummaryCard
        summary={{ ...briefSample, totalMarketValue: 215600 }}
        currency="CAD"
      />,
    );

    expect(screen.getByText("$215,600.00")).toBeDefined();
    expect(screen.queryByText("$482,350.12")).toBeNull();
  });
});
