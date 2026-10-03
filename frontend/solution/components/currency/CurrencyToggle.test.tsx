import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DashboardProvider } from "@/components/providers/DashboardProvider";
import PortfolioSummary from "@/components/summary/PortfolioSummary";
import { stubMockApi } from "@/test/mockApi";
import CurrencyToggle from "./CurrencyToggle";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderDashboard() {
  return render(
    <DashboardProvider>
      <CurrencyToggle />
      <PortfolioSummary />
    </DashboardProvider>,
  );
}

const button = (name: string) => screen.getByRole("button", { name });

describe("CurrencyToggle", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts on CAD", async () => {
    stubMockApi();
    renderDashboard();

    expect(await screen.findByText("$65,680.00")).toBeDefined();
    expect(button("CAD").getAttribute("aria-pressed")).toBe("true");
    expect(button("USD").getAttribute("aria-pressed")).toBe("false");
  });

  it("converts dollar figures to USD but leaves percentages alone", async () => {
    stubMockApi();
    renderDashboard();
    await screen.findByText("$65,680.00");
    await waitFor(() => expect(button("USD").hasAttribute("disabled")).toBe(false));

    fireEvent.click(button("USD"));

    // 65,680 × 0.73 and 397.25 × 0.73
    expect(screen.getByText("US$47,946.40")).toBeDefined();
    expect(screen.getByTestId("day-change").textContent).toBe(
      "+US$289.99 (+0.61%)",
    );
    expect(screen.getByTestId("total-return").textContent).toBe("+18.7%");
    expect(button("USD").getAttribute("aria-pressed")).toBe("true");
  });

  it("switches back to CAD without reloading any data", async () => {
    const fetchMock = stubMockApi();
    renderDashboard();
    await screen.findByText("$65,680.00");
    await waitFor(() => expect(button("USD").hasAttribute("disabled")).toBe(false));
    const requestsBefore = fetchMock.mock.calls.length;

    fireEvent.click(button("USD"));
    fireEvent.click(button("CAD"));

    expect(screen.getByText("$65,680.00")).toBeDefined();
    expect(fetchMock.mock.calls.length).toBe(requestsBefore);
  });

  it("shows the current exchange rate", async () => {
    stubMockApi();
    renderDashboard();

    expect(screen.getByTestId("exchange-rate").textContent).toBe("Loading rate…");
    await waitFor(() =>
      expect(screen.getByTestId("exchange-rate").textContent).toBe(
        "1 CAD = 0.73 USD",
      ),
    );
  });

  it("keeps USD unavailable if the exchange rate can't load", async () => {
    stubMockApi({ failRate: true });
    renderDashboard();
    await screen.findByText("$65,680.00");

    await waitFor(() =>
      expect(screen.getByTestId("exchange-rate").textContent).toBe(
        "Rate unavailable",
      ),
    );
    expect(button("USD").hasAttribute("disabled")).toBe(true);
  });
});
