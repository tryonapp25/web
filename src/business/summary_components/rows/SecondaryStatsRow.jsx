import styles from "../SummaryBoard.module.css";
import StatCard from "../ui/StatCard";

export default function SecondaryStatsRow({data = []}) {
  return (
    <section className={styles.secondaryStatsGrid}>
      {data.length > 0 && data.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          isCurrency={item.isCurrency}
          description={item.description}
        />
      ))}
    </section>
  );
}