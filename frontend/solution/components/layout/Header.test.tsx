import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardProvider } from "@/components/providers/DashboardProvider";
import { stubMockApi } from "@/test/mockApi";
import Header from "./Header";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderHeader() {
  stubMockApi();
  return render(
    <DashboardProvider>
      <Header />
    </DashboardProvider>,
  );
}

describe("Header", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders as the page banner", () => {
    renderHeader();

    expect(screen.getByRole("banner")).toBeDefined();
  });

  it("has the account selector slot and the currency toggle", () => {
    renderHeader();

    expect(screen.getByText("Account selector")).toBeDefined();
    expect(screen.getByRole("group", { name: "Display currency" })).toBeDefined();
  });
});
