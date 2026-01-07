import styles from "../styles/Header.module.css";
import { UserContext } from "../ApiContext/userContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const { publicUser } = useContext(UserContext)
  const [tokens, setTokens] = useState(publicUser?.token?.tokens);

  useEffect(()=> {
    setTokens(publicUser?.token?.tokens || 0);
  },[publicUser])

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.userLabel}>Username</span>
        <span className={styles.userName}>{publicUser?.userName}</span>
      </div>

      <div className={styles.right}>
        <span className={styles.tokenLabel}>Tokens</span>

        <Link to="/payment">
          <div className={styles.tokenBox}>
            <span className={styles.icon}>⚡</span>
            <span className={styles.tokenValue}>{tokens}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
