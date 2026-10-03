import type { ApiState } from "@/lib/useApi";
import styles from "./StatusMessage.module.css";

// Shows "Loading…" or an error with a retry button. Shows nothing once data has loaded.
export default function StatusMessage({ state }: { state: ApiState<unknown> }) {
  if (state.status === "loading") {
    return (
      <p role="status" className={styles.message}>
        Loading…
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div role="alert" className={styles.error}>
        <p className={styles.message}>Couldn&apos;t load data: {state.error}</p>
        <button type="button" className={styles.retry} onClick={state.retry}>
          Try again
        </button>
      </div>
    );
  }

  return null;
}
