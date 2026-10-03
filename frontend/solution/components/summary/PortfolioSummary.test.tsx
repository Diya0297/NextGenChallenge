import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DashboardProvider } from "@/components/providers/DashboardProvider";
import { stubMockApi } from "@/test/mockApi";
import PortfolioSummary from "./PortfolioSummary";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderSummary() {
  return render(
    <DashboardProvider>
      <PortfolioSummary />
    </DashboardProvider>,
  );
}

describe("PortfolioSummary", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading message, then the first account's summary", async () => {
    const fetchMock = stubMockApi();
    renderSummary();

    expect(screen.getByRole("status").textContent).toBe("Loading…");
    expect(await screen.findByText("$65,680.00")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/portfolios/P-9001",
      expect.anything(),
    );
  });

  it("shows an error with a working Try again button", async () => {
    stubMockApi({ failFirst: true });
    renderSummary();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Service unavailable");

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("$65,680.00")).toBeDefined();
  });
});
