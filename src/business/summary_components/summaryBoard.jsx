import styles from "./SummaryBoard.module.css";
import TopStatsRow from "./rows/TopStatsRow";
import SecondaryStatsRow from "./rows/SecondaryStatsRow";
import SalesChartRow from "./rows/SalesChartRow";
import RecentOrdersRow from "./rows/RecentOrdersRow";


export default function Dashboard({data}) {
  const { topStatsRow, secondaryStatsRow, sales} = data;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Today&apos;s Summary</h1>

        <TopStatsRow data={topStatsRow} />
        <SecondaryStatsRow data={secondaryStatsRow} /> 
        <SalesChartRow data={sales} />
        <RecentOrdersRow/>
      </div>
    </main>
  );
}