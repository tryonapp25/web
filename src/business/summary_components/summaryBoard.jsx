import styles from "./SummaryBoard.module.css";
import TopStatsRow from "./rows/TopStatsRow";
import SecondaryStatsRow from "./rows/SecondaryStatsRow";
import SalesChartRow from "./rows/SalesChartRow";
import BottomCardsRow from "./rows/BottomCardsRow";
import RecentOrdersRow from "./rows/RecentOrdersRow";

export default function Dashboard({data}) {
  const { topStatsRow, secondaryStatsRow, orderStatus, topProducts} = data;
  console.log("Dashboard received data:", data);
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Today&apos;s Summary</h1>

        <TopStatsRow data={topStatsRow} />
        <SecondaryStatsRow data={secondaryStatsRow} /> 
        <SalesChartRow data={orderStatus} />
        {/*
        <BottomCardsRow orderStatus={orderStatus} topProducts={topProducts} />
        <RecentOrdersRow data={recentOrders} /> */} 
      </div>
    </main>
  );
}