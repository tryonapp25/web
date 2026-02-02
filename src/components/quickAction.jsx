import { useState , useRef,useEffect, useContext, useCallback} from "react";
import styles from "../styles/QuickAction.module.css";


const cx = (...c) => c.filter(Boolean).join(" ");



export default function QuickAction({data = [], onPress}) {
  const [tab, setTab] = useState("templates");
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
