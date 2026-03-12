import styles from "../SummaryBoard.module.css";
import SectionCard from "../ui/SectionCard";

const chartPoints = [
  { x: 20, y: 150 },
  { x: 100, y: 120 },
  { x: 180, y: 145 },
  { x: 260, y: 80 },
  { x: 340, y: 135 },
  { x: 420, y: 95 },
  { x: 500, y: 145 },
  { x: 580, y: 60 },
  { x: 660, y: 135 },
  { x: 740, y: 100 },
];

const pointString = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");

export default function SalesChartRow() {
  return (
    <section className={styles.fullRow}>
      <SectionCard title="Sales Today">
        <div className={styles.chartWrap}>
          <div className={styles.chartLabel}>Revenue</div>

          <svg
            viewBox="0 0 760 180"
            className={styles.chart}
            preserveAspectRatio="none"
          >
            <line x1="0" y1="30" x2="760" y2="30" className={styles.gridLine} />
            <line x1="0" y1="70" x2="760" y2="70" className={styles.gridLine} />
            <line x1="0" y1="110" x2="760" y2="110" className={styles.gridLine} />
            <line x1="0" y1="150" x2="760" y2="150" className={styles.gridLine} />

            <polyline points={pointString} className={styles.chartLine} />

            {chartPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="5"
                className={styles.chartPoint}
              />
            ))}
          </svg>
        </div>
      </SectionCard>
    </section>
  );
}