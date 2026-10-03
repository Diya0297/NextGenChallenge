import styles from "./Header.module.css";

// Slots for Task 8 (account selector, left) and Task 7 (currency toggle, right)
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.slot}>Account selector</div>
      <div className={styles.slot}>CAD / USD</div>
    </header>
  );
}
