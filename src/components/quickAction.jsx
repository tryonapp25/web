import { useState , useMemo, useEffect} from "react";
import styles from "../styles/QuickAction.module.css";


const cx = (...c) => c.filter(Boolean).join(" ");



export default function QuickAction({data = [], onPress}) {
  const [tab, setTab] = useState("templates");

  const initialTab = useMemo(() => {
    const active = data.find((x) => x?.isActive);
    return active?.tabName ?? data[0]?.tabName
  }, [data]);
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  if(data.length === 0) return;
 
  return (
    <section className={styles.exploreWrap}>
      <div className={styles.exploreTabs}>
        {data.map((item, index) => (
          <button
            key={index}
            className={cx(styles.exTab, tab === item.tabName && styles.exTabActive)}
            onClick={() => {
              setTab(item.tabName);
              onPress(item.tabName);
            }}
          >
            {item.name}
          </button>
        ))}

      </div>
    </section>
  );
}
