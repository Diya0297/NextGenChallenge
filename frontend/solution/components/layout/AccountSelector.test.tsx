import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountSelector from "./AccountSelector";
import { AccountProvider, type AccountOption } from "@/context/AccountContext";

describe("AccountSelector Component", () => {
  const mockAccounts: AccountOption[] = [
    { accountId: "P-9001", label: "Taxable Brokerage", totalMarketValue: 482350.12 },
    { accountId: "P-9002", label: "Traditional IRA", totalMarketValue: 215600.0 },
  ];

  it("renders active account label and badge", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts} initialSelectedId="P-9001">
        <AccountSelector />
      </AccountProvider>
    );

    expect(screen.getByText("Taxable Brokerage")).toBeDefined();
    expect(screen.getByText("P-9001")).toBeDefined();
    expect(screen.getByText("Account selector")).toBeDefined();
  });

  it("opens dropdown menu when clicked and shows all accounts", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts} initialSelectedId="P-9001">
        <AccountSelector />
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);

    expect(screen.getByRole("listbox", { name: "Accounts list" })).toBeDefined();
    expect(screen.getByText("Traditional IRA")).toBeDefined();
  });

  it("selects an account and closes dropdown on option click", () => {
    render(
      <AccountProvider initialAccounts={mockAccounts} initialSelectedId="P-9001">
        <AccountSelector />
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);

    const iraOption = screen.getByRole("option", { name: /Traditional IRA/i });
    fireEvent.click(iraOption);

    // Dropdown should close
    expect(screen.queryByRole("listbox")).toBeNull();

    // Trigger should now display Traditional IRA
    expect(screen.getByText("Traditional IRA")).toBeDefined();
    expect(screen.getByText("P-9002")).toBeDefined();
  });

  it("handles single-account edge case gracefully without opening dropdown", () => {
    const singleAccount: AccountOption[] = [
      { accountId: "P-9001", label: "Taxable Brokerage", totalMarketValue: 482350.12 },
    ];

    render(
      <AccountProvider initialAccounts={singleAccount}>
        <AccountSelector />
      </AccountProvider>
    );

    const trigger = screen.getByRole("button", { name: /Select account/i });
    fireEvent.click(trigger);

    // No dropdown should appear for single account
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("Taxable Brokerage")).toBeDefined();
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
