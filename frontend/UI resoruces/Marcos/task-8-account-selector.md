# Task 8: Multi-Portfolio / Account Selector — Technical Plan

**Role:** Person C (Marcos)  
**Branch:** `marcos-branch`  
**Target Locations:**
- State Management: `components/context/AccountContext.tsx`
- Component: `components/layout/AccountSelector.tsx`
- Spec / Checklist: `frontend/UI resoruces/Marcos/task-8-account-selector.md`

---

## 1. Objectives & Requirements
- Enable clients holding multiple portfolios (e.g., Taxable Brokerage vs. Traditional IRA) to switch views seamlessly without a full page reload.
- The selector lives in the **top-left slot of the Header** (`Header.tsx`).
- Selecting an account propagates to all dashboard components:
  - Portfolio Summary Card (Task 2)
  - Holdings Table (Task 3)
  - Portfolio Value Line Chart (Task 4)
  - Asset Allocation Donut Chart (Task 5)
  - Top Movers Widget (Task 10)
- Clearly indicates the currently selected account label and total market value.

---

## 2. API Contract & Mock Data

### Mock Server Endpoint
`GET http://localhost:4000/accounts` (supports `?scenario=...`)

### Account Model
```typescript
export interface AccountOption {
  accountId: string;       // e.g. "P-9001"
  label: string;           // e.g. "Taxable Brokerage"
  totalMarketValue: number;// e.g. 482350.12
}
```

### Fallback Mock Data (when server is offline)
```json
[
  { "accountId": "P-9001", "label": "Taxable Brokerage", "totalMarketValue": 482350.12 },
  { "accountId": "P-9002", "label": "Traditional IRA", "totalMarketValue": 215600.0 }
]
```

---

## 3. Architecture & Shared State: `AccountContext`

Because Task 8 is a **cross-cutting concern** that touches the header slot and feeds data into components throughout the page, state should live in a React Context:

```typescript
export interface AccountContextType {
  accounts: AccountOption[];
  selectedAccountId: string;
  selectedAccount: AccountOption | null;
  selectAccount: (accountId: string) => void;
  isLoading: boolean;
}
```

### State Propagation Flow:
1. `AccountProvider` wraps the layout or page.
2. `AccountSelector` renders inside `Header.tsx` (left slot).
3. `PortfolioValueSection` and `AssetAllocationSection` consume `selectedAccountId` from `useAccount()`, automatically re-fetching and updating charts when the account changes.

---

## 4. UI / UX Design Specifications (per `finance-ui-design`)
- **Control Type:** Custom styled select menu or dropdown popover.
- **Trigger Button:** Displays current account label, short ID badge, and a chevron icon:
  - Background: `var(--surface)` with `var(--border)` outline.
  - Typography: Inter font, bold active label with muted account ID.
- **Dropdown Menu:**
  - Glassmorphic card surface (`#1c2638`), subtle border glow, and box shadow.
  - Each item shows: Account Name, Account ID, formatted Balance, and an active checkmark.
- **Accessibility:**
  - ARIA attributes: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`.
  - Keyboard navigation: `Escape` closes, `ArrowDown`/`ArrowUp` navigates, `Enter` selects.
  - Click outside detection to close the popover.

---

## 5. Comprehensive Edge Cases & Improvements

| Category | Edge Case / Scenario | Strategy & Handling |
|---|---|---|
| **Single Account** | Client has only 1 account (`?scenario=single-account`) | Selector displays the account label and balance but hides the dropdown chevron or shows a disabled/read-only indicator without throwing errors. |
| **Race Conditions** | User clicks rapidly between accounts | Use `AbortController` in all data-fetching effects to cancel in-flight requests, preventing out-of-order state overwrites. |
| **State Retention** | Switching accounts | **Retain** global settings (CAD/USD currency toggle from Task 7, date range from Task 6). **Reset** holding-specific transient state (e.g. closing any open holding detail view for a ticker that doesn't exist in the new portfolio). |
| **Empty Portfolio** | Selected account has 0 positions (`?scenario=empty`) | Charts and cards handle 0 values gracefully without throwing `NaN` or unhandled exceptions. |
| **Network Error** | Backend down or `?fail=true` | Fall back gracefully to mock accounts; display inline retry state or toast instead of blanking out the header. |
| **URL Sync (Improvement)** | Deep linking / bookmarking | Optionally sync `?accountId=P-9002` into the URL query string so refreshing preserves the active account. |
| **Keyboard Nav (Improvement)** | Tab & keyboard access | Full WAI-ARIA compliance so power users can switch accounts via keyboard shortcuts. |

---

## 6. Implementation Steps Plan
1. **`AccountContext.tsx`**: Context, custom hook `useAccount()`, and provider fetching `/accounts` with fallback mock data.
2. **`AccountSelector.tsx` & `.module.css`**: Accessible dropdown trigger, popover list, and click-outside handler.
3. **Connect to Header**: Plug `<AccountSelector />` into `components/layout/Header.tsx` slot.
4. **Wire Sections**: Update `PortfolioValueSection.tsx` and `AssetAllocationSection.tsx` to read `selectedAccountId` from `useAccount()`.
5. **Unit Tests**: Test single-account mode, account switching, keyboard interactions, and graceful API fallback.
