import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import OverviewPage from "./page";

describe("Portfolio Overview page", () => {
  it("shows the Portfolio Overview heading", () => {
    render(<OverviewPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Portfolio Overview" }),
    ).toBeDefined();
  });

  it("has a card slot for every dashboard section", () => {
    render(<OverviewPage />);

    for (const title of [
      "Portfolio Summary",
      "Portfolio Value",
      "Asset Allocation",
      "Top Movers",
      "Holdings",
    ]) {
      expect(screen.getByRole("region", { name: title })).toBeDefined();
    }
  });
});
