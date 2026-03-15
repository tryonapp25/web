import styles from "../SummaryBoard.module.css";
import { useContext, useMemo } from "react";
import { UserContext } from "../../../ApiContext/userContext";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";

const margin = { right: 24 };

const todayStr = new Date()
  .toLocaleDateString("en-US", { weekday: "long" })
  .toLowerCase();

function getHourlyLabels(hoursConfig) {
  if (!hoursConfig?.open || !hoursConfig?.close) return [];

  const start = parseInt(hoursConfig.open.split(":")[0], 10);
  const end = parseInt(hoursConfig.close.split(":")[0], 10);

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return [];

  const hours = [];
  for (let h = start; h <= end; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
  }

  return hours;
}

export default function SalesChartRow({ data = [] }) {
  const { publicUser } = useContext(UserContext);
  const openHours = publicUser?.business?.openHours || {};
  const todayHours = openHours[todayStr];


  const xLabels = useMemo(() => getHourlyLabels(todayHours), [todayHours]);

  const values = useMemo(() => {
    const valueMap = new Map(data.map((item) => [item.title, item.value]));
    return xLabels.map((label) => valueMap.get(label) ?? 0);
  }, [data, xLabels]);

  return (
    <main className={styles.page}>
      <Box sx={{ width: "100%", height: 300 }}>
        <LineChart
          series={[{ data: values, label: "Sales", area: true, showMark: true, valueFormatter: (v) => `${v} ${publicUser?.currency}` }]}
          xAxis={[{ scaleType: "point", data: xLabels, height: 28 }]}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              display: "none",
            },
          }}
          margin={margin}
        />
      </Box>
    </main>
  );
}