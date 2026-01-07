import styles from "../styles/ExploreTabs.module.css";
import { useEffect, useContext, useState } from "react";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";

export default function ExploreTabs({ onSubmit, onError }) {
  const { publicUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    // Load default tab on mount
    getHistoryGenerations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHistoryGenerations = async () => {
    setActiveTab("history");

    try {
      const res = await http.get(
        `/history/image-generation/user/${publicUser?.uid}`
      );
      if (res.data.success) {
        onSubmit({
          id: "history",
          data: res.data.data || [],
        });
      }
    } catch (err) {
      onError(err);
    }
  };

  const getUserPoses = () => {
    setActiveTab("poses");

    onSubmit({
      id: "poses",
      data: publicUser?.poses || [],
    });
  };

  return (
    <div className={styles.tabs}>
      <button
        className={activeTab === "history" ? styles.active : ""}
        onClick={getHistoryGenerations}
        type="button"
      >
        Recent generations
      </button>

      <button
        className={activeTab === "poses" ? styles.active : ""}
        onClick={getUserPoses}
        type="button"
      >
        My avatar
      </button>

      {/* <button type="button">My Closet</button> */}
    </div>
  );
}
