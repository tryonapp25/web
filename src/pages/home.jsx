import { useRef, useState } from "react";
import styles from "../styles/home.module.css";
import Sidebar from "../homeComponents/sideBar";
import Topbar from "../homeComponents/topbar";
import ExploreTabs from "../homeComponents/exploreTabs";
import GeneratorCard from "../homeComponents/generatorCard";

function HeroTitle() {
  return (
    <div className={styles.heroHead}>
      <h1 className={styles.pageTitle}>
        AI Filters You Can Create, Use, and Share.
      </h1>
    </div>
  );
}

export default function Home() {
  const generatorRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleOnPressFilter = (item) => {
    scrollToGenerator();
    setSelectedFilter(item);
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <Sidebar />

        <main className={styles.main}>
          <div ref={generatorRef}>
            <Topbar onGenerateClick={scrollToGenerator} />
          </div>
          <div className={styles.content}>
            <div ref={generatorRef}>
              <HeroTitle />
              <GeneratorCard filter={selectedFilter} scroll={scrollToGenerator} onClear={() => setSelectedFilter(null)}/>
            </div>

            <ExploreTabs onPressFilter={(d) => handleOnPressFilter(d)} />
          </div>
        </main>
      </div>
    </div>
  );
}
