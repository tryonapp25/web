import styles from "../SummaryBoard.module.css";
import StatCard from "../ui/StatCard";

export default function TopStatsRow({data = []}) {
  return (
    <section className={styles.topStatsGrid}>
      {data.length > 0 && data.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          large
        />
      ))}
    </section>
  );
}