import PortfolioSummary from "@/components/summary/PortfolioSummary";
import Card from "@/components/ui/Card";
import styles from "./page.module.css";

// Each card is a slot. Replace its placeholder with the real component.
export default function OverviewPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Portfolio Overview</h1>

      <div className={styles.grid}>
        <Card title="Portfolio Summary" className={styles.summary}>
          <PortfolioSummary />
        </Card>

        <Card title="Portfolio Value" className={styles.valueChart}>
          <p className={styles.placeholder}>
            Tasks 4 &amp; 6: value chart and date range (Person C)
          </p>
        </Card>

        <Card title="Asset Allocation" className={styles.allocation}>
          <p className={styles.placeholder}>Task 5: allocation chart (Person C)</p>
        </Card>

        <Card title="Top Movers" className={styles.movers}>
          <p className={styles.placeholder}>Task 10: top movers (Person B)</p>
        </Card>

        <Card title="Holdings" className={styles.holdings}>
          <p className={styles.placeholder}>
            Tasks 3 &amp; 9: holdings table and detail view (Person B)
          </p>
        </Card>
      </div>
    </main>
  );
}
