import CurrencyToggle from "@/components/currency/CurrencyToggle";
import AccountSelector from "./AccountSelector";
import styles from "./Header.module.css";

// Account selector slot (left, Task 8) and currency toggle (right, Task 7)
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.slot}>
        <AccountSelector />
      </div>
      <CurrencyToggle />
    </header>
  );
}
