import { useEffect, useMemo, useState, useRef, useContext } from "react";
import styles from "../styles/PosPage.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext }  from "../ApiContext/userContext";
import { HandeleSocketConnectForBusiness } from "../utils/socketio";

import Sidebar from "../components_business/businessSidebar";
import CategoryTabs from "../components_business/businessCategoryTabs";
import ProductGrid from "../components_business/businessProductGrid";

const CATEGORIES = ["Alle produkter", "Kaffe", "Kolde drikke", "Mad"];

const PRODUCTS = [
  { id: "p1", name: "Americano", price: 30, category: "Kaffe", subtitle: "" },
  { id: "p2", name: "Avocado mad", price: 62, category: "Mad", subtitle: "" },
  { id: "p3", name: "Banankage", price: 38, category: "Mad", subtitle: "" },
  { id: "p4", name: "Cappuccino", price: 42, category: "Kaffe", subtitle: "" },
  { id: "p5", name: "Cold Brew", price: 48, category: "Kolde drikke", subtitle: "" },
  { id: "p6", name: "Croissant", price: 0, category: "Mad", subtitle: "2 varianter" },
  { id: "p7", name: "Espresso", price: 28, category: "Kaffe", subtitle: "" },
  { id: "p8", name: "Latte", price: 0, category: "Kaffe", subtitle: "3 varianter" },
  { id: "p9", name: "Muffin", price: 25, category: "Mad", subtitle: "" },
  { id: "p10", name: "Smoothie", price: 0, category: "Kolde drikke", subtitle: "flere varianter" },
  { id: "p11", name: "Snurre", price: 0, category: "Mad", subtitle: "2 varianter" },
  { id: "p12", name: "Surdejs bolle", price: 0, category: "Mad", subtitle: "3 varianter" },
];

export default function PosPage() {
  const navigate = useNavigate();
  const hasConnected = useRef(false);
  const socketRef = useRef(null);
  const { publicUser } = useContext(UserContext);
  const [activeCategory, setActiveCategory] = useState("Alle produkter");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const connectSocket = async () => {
      try {
        socketRef.current = await HandeleSocketConnectForBusiness(publicUser);
      } catch (err) {
        console.error("Socket connect error:", err);
      }
    };

    if (!publicUser) {
      navigate("/login");
      return;
    }
    if (!hasConnected.current) {
      hasConnected.current = true;
      connectSocket();
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const inCategory =
        activeCategory === "Alle produkter" || p.category === activeCategory;

      const inQuery =
        query.trim().length === 0 ||
        p.name.toLowerCase().includes(query.trim().toLowerCase());

      return inCategory && inQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.topRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              className={styles.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg produkter…"
              aria-label="Søg produkter"
            />
          </div>
        </div>

        <CategoryTabs
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
}