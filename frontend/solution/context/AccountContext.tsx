"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

export interface AccountOption {
  accountId: string;
  label: string;
  totalMarketValue: number;
}

export interface AccountContextType {
  accounts: AccountOption[];
  selectedAccountId: string;
  selectedAccount: AccountOption | null;
  selectAccount: (accountId: string) => void;
  isLoading: boolean;
}

const DEFAULT_ACCOUNTS: AccountOption[] = [
  {
    accountId: "P-9001",
    label: "Taxable Brokerage",
    totalMarketValue: 482350.12,
  },
  {
    accountId: "P-9002",
    label: "Traditional IRA",
    totalMarketValue: 215600.0,
  },
];

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export interface AccountProviderProps {
  children: ReactNode;
  initialAccounts?: AccountOption[];
  initialSelectedId?: string;
}

export function AccountProvider({
  children,
  initialAccounts,
  initialSelectedId,
}: AccountProviderProps) {
  const [fetchedAccounts, setFetchedAccounts] = useState<AccountOption[] | null>(null);
  const [isLoading, setIsLoading] = useState(!initialAccounts);

  const accounts = useMemo(
    () => initialAccounts ?? fetchedAccounts ?? DEFAULT_ACCOUNTS,
    [initialAccounts, fetchedAccounts]
  );

  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => {
    if (initialSelectedId) return initialSelectedId;
    if (typeof window !== "undefined") {
      const paramId = new URLSearchParams(window.location.search).get("accountId");
      if (paramId) return paramId;
    }
    return initialAccounts?.[0]?.accountId ?? DEFAULT_ACCOUNTS[0].accountId;
  });

  // Derive valid account ID without cascading setState
  const effectiveAccountId = useMemo(() => {
    if (accounts.some((a) => a.accountId === selectedAccountId)) {
      return selectedAccountId;
    }
    return accounts[0]?.accountId ?? selectedAccountId;
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    if (initialAccounts) return;

    const abortController = new AbortController();

    async function loadAccounts() {
      setIsLoading(true);
      try {
        let scenarioParam = "";
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const scenario = params.get("scenario");
          if (scenario) {
            scenarioParam = `?scenario=${encodeURIComponent(scenario)}`;
          }
        }

        const res = await fetch(`http://localhost:4000/accounts${scenarioParam}`, {
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setFetchedAccounts(json);
        } else {
          setFetchedAccounts(DEFAULT_ACCOUNTS);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          setFetchedAccounts(DEFAULT_ACCOUNTS);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAccounts();

    return () => {
      abortController.abort();
    };
  }, [initialAccounts]);

  const selectAccount = (id: string) => {
    setSelectedAccountId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("accountId", id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const selectedAccount = useMemo(() => {
    return accounts.find((a) => a.accountId === effectiveAccountId) ?? accounts[0] ?? null;
  }, [accounts, effectiveAccountId]);

  const contextValue = useMemo(
    () => ({
      accounts,
      selectedAccountId: effectiveAccountId,
      selectedAccount,
      selectAccount,
      isLoading,
    }),
    [accounts, effectiveAccountId, selectedAccount, isLoading]
  );

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(): AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    // Graceful fallback for isolated component testing or unprovided trees
    return {
      accounts: DEFAULT_ACCOUNTS,
      selectedAccountId: DEFAULT_ACCOUNTS[0].accountId,
      selectedAccount: DEFAULT_ACCOUNTS[0],
      selectAccount: () => {},
      isLoading: false,
    };
  }
  return context;
}
