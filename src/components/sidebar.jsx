import styles from "../styles/Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../ApiContext/userContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { publicUser } = useContext(UserContext);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>◎</div>

      <nav className={styles.menu}>
        <button className={styles.active} onClick={() => navigate("/home")}>Explore</button>
        <button className={styles.active} onClick={() => navigate("/profile")}>Profile</button>
        {publicUser?.poses.length === 0 && <button className={styles.active} onClick={() => navigate("/createPoses")}>Create Poses</button>}
      </nav>
    </aside>
  );
}
