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

export default function BusinessBoard() {
  const navigate = useNavigate();
  const hasConnected = useRef(false);
  const socketRef = useRef(null);
  const { publicUser } = useContext(UserContext);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Alle produkter");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const connectSocket = async () => {
      try {
        socketRef.current = await HandeleSocketConnectForBusiness(publicUser);
        if (socketRef.current) {
          // update connection state and attach event listeners
          setIsSocketConnected(socketRef.current.connected ?? true);
          socketRef.current.on("connect", () => setIsSocketConnected(true));
          socketRef.current.on("disconnect", () => setIsSocketConnected(false));
          socketRef.current.on("new-order", (order, ack) => {
            alert("Ny ordre modtaget! Tjek ordreliste.");
            console.log("New order received:", order);
            if (ack) ack({ success: true });
          });
        }
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
    return () => {
      // cleanup listeners on unmount
      if (socketRef.current) {
        try {
          socketRef.current.off && socketRef.current.off("connect");
          socketRef.current.off && socketRef.current.off("disconnect");
          socketRef.current.off && socketRef.current.off("new-order");
          socketRef.current.close && socketRef.current.close();
        } catch (e) {
          console.warn("Error cleaning up socket:", e);
        }
        socketRef.current = null;
      }
    };
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
          <p style={{marginRight:"12px"}}>{socketRef.current !== null ? "Connected" : "Not connected"}</p>
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