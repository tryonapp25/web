import { useState , useRef,useEffect, useContext, useCallback} from "react";
import styles from "../styles/QuickAction.module.css";


const cx = (...c) => c.filter(Boolean).join(" ");
const defaultMessage = {visible: false,type: "",msg: ""}

export default function QuickAction({onPress}) {
  const [tab, setTab] = useState("templates");
 
  return (
    <section className={styles.exploreWrap}>
      <div className={styles.exploreTabs}>
        <button
          className={cx(styles.exTab, tab === "templates" && styles.exTabActive)}
          onClick={() => {setTab("templates"), onPress("templates")}}
        >
          Explore
        </button>

        <button
          className={cx(styles.exTab, tab === "mine" && styles.exTabActive)}
          onClick={() => {setTab("mine"), onPress("mine")}}
        >
          My templates
        </button>

        <button
          className={cx(styles.exTab, tab === "menu_book" && styles.exTabActive)}
          onClick={() => {setTab("menu_book"), onPress("menu_book")}}
        >
          MenuBook
        </button>
      </div>
    </section>
  );
}
