import { useId, type ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

// Shared box used by every dashboard section.
// aria-labelledby names the section after its title, for screen readers.
export default function Card({ title, children, className }: CardProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={`${styles.card} ${className ?? ""}`}
    >
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {children}
    </section>
  );
}
