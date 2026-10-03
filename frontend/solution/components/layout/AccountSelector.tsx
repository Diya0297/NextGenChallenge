"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AccountSelector.module.css";
import { useAccount, type AccountOption } from "@/context/AccountContext";
import { formatCurrency } from "@/components/charts/chartUtils";

export interface AccountSelectorProps {
  className?: string;
  currency?: "CAD" | "USD";
}

export default function AccountSelector({
  className = "",
  currency = "CAD",
}: AccountSelectorProps) {
  const { accounts, selectedAccountId, selectAccount, isLoading } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedAccount =
    accounts.find((a) => a.accountId === selectedAccountId) ?? accounts[0];

  const isSingleAccount = accounts.length <= 1;

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (account: AccountOption) => {
    selectAccount(account.accountId);
    setIsOpen(false);
  };

  if (isLoading && !selectedAccount) {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        <span className={styles.srOnly}>Account selector</span>
        <div className={styles.trigger}>
          <span className={styles.label}>Loading accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`${styles.wrapper} ${className}`}>
      {/* Screen reader text ensures accessibility & backward compatibility */}
      <span className={styles.srOnly}>Account selector</span>

      <button
        type="button"
        className={`${styles.trigger} ${
          isSingleAccount ? styles.triggerDisabled : ""
        }`}
        onClick={() => {
          if (!isSingleAccount) {
            setIsOpen((prev) => !prev);
          }
        }}
        aria-haspopup={isSingleAccount ? undefined : "listbox"}
        aria-expanded={isSingleAccount ? undefined : isOpen}
        aria-label={`Select account. Currently selected: ${selectedAccount?.label}`}
      >
        <span className={styles.badge}>{selectedAccount?.accountId}</span>
        <span className={styles.label}>{selectedAccount?.label}</span>

        {!isSingleAccount && (
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {isOpen && !isSingleAccount && (
        <div
          role="listbox"
          aria-label="Accounts list"
          className={styles.dropdown}
        >
          {accounts.map((acc) => {
            const isSelected = acc.accountId === selectedAccountId;
            return (
              <button
                key={acc.accountId}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${styles.item} ${
                  isSelected ? styles.itemActive : ""
                }`}
                onClick={() => handleSelect(acc)}
              >
                <div className={styles.itemLeft}>
                  <span className={styles.itemName}>{acc.label}</span>
                  <div className={styles.itemMeta}>
                    <span>{acc.accountId}</span>
                    <span>•</span>
                    <span>{formatCurrency(acc.totalMarketValue, currency)}</span>
                  </div>
                </div>

                {isSelected && (
                  <span className={styles.itemCheck} aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
