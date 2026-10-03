import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountSelector from "./AccountSelector";
import { AccountProvider, useAccount, type AccountOption } from "@/context/AccountContext";

function AccountConsumer() {
  const { selectedAccountId, selectedAccount } = useAccount();
  return (
    <div data-testid="consumer">
      <span data-testid="active-id">{selectedAccountId}</span>
      <span data-testid="active-label">{selectedAccount?.label}</span>
    </div>
  );
}

describe("Task 8: Multi-Portfolio / AccountSelector Component", () => {
  const mockAccounts: AccountOption[] = [
    { accountId: "P-9001", label: "Taxable Brokerage", totalMarketValue: 482350.12 },
    { accountId: "P-9002", label: "Traditional IRA", totalMarketValue: 215600.0 },
  ];

  it("satisfies Expected Behaviour: clearly indicates the currently selected account label and badge", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts} initialSelectedId="P-9001">
        <AccountSelector />
      </AccountProvider>
    );

    expect(screen.getByText("Taxable Brokerage")).toBeDefined();
    expect(screen.getByText("P-9001")).toBeDefined();
    expect(screen.getByText("Account selector")).toBeDefined();
  });

  it("satisfies Definition of Done: renders with 2+ mock accounts in an accessible dropdown list", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts} initialSelectedId="P-9001">
        <AccountSelector />
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("listbox", { name: "Accounts list" })).toBeDefined();

    // Verify both accounts and their formatted balances are present
    expect(screen.getByText("Traditional IRA")).toBeDefined();
    expect(screen.getByText("P-9002")).toBeDefined();
    expect(screen.getByText("$482,350.12")).toBeDefined();
    expect(screen.getByText("$215,600.00")).toBeDefined();
  });

  it("satisfies Definition of Done: selecting an account updates shared context and dependent components without page reload", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts} initialSelectedId="P-9001">
        <AccountSelector />
        <AccountConsumer />
      </AccountProvider>
    );

    // Initial state
    expect(screen.getByTestId("active-id").textContent).toBe("P-9001");
    expect(screen.getByTestId("active-label").textContent).toBe("Taxable Brokerage");

    // Click trigger and select Traditional IRA
    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);

    const iraOption = screen.getByRole("option", { name: /Traditional IRA/i });
    fireEvent.click(iraOption);

    // Dropdown should close immediately
    expect(screen.queryByRole("listbox")).toBeNull();

    // Trigger and consumer should both reflect new account
    expect(screen.getAllByText("Traditional IRA").length).toBe(2);
    expect(screen.getAllByText("P-9002").length).toBe(2);

    // Dependent consumer should be reactively updated
    expect(screen.getByTestId("active-id").textContent).toBe("P-9002");
    expect(screen.getByTestId("active-label").textContent).toBe("Traditional IRA");
  });

  it("satisfies Edge Case: handles a single-account portfolio gracefully without errors or opening dropdown", () => {
    const singleAccount: AccountOption[] = [
      { accountId: "P-9001", label: "Taxable Brokerage", totalMarketValue: 482350.12 },
    ];

    const { container } = render(
      <AccountProvider initialAccounts={singleAccount}>
        <AccountSelector />
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);

    // No dropdown popover should open for single account
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("Taxable Brokerage")).toBeDefined();

    // Chevron SVG should not be rendered for single account
    expect(container.querySelector("svg")).toBeNull();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts}>
        <div>
          <span data-testid="outside">Outside area</span>
          <AccountSelector />
        </div>
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeDefined();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes dropdown when Escape key is pressed", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts}>
        <AccountSelector />
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
