import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardProvider } from "@/components/providers/DashboardProvider";
import { stubMockApi } from "@/test/mockApi";
import OverviewPage from "./page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderPage() {
  return render(
    <DashboardProvider>
      <OverviewPage />
    </DashboardProvider>,
  );
}

describe("Portfolio Overview page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the Portfolio Overview heading", () => {
    stubMockApi();
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Portfolio Overview" }),
    ).toBeDefined();
  });

  it("has a card slot for every dashboard section", () => {
    stubMockApi();
    renderPage();

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

  it("fills the summary card with live data", async () => {
    stubMockApi();
    renderPage();

    expect(await screen.findByText("$65,680.00")).toBeDefined();
  });
});
