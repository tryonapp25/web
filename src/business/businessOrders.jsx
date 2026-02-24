import styles from "../styles/OrderBoard.module.css";
import OrdersGrid from "../components_business/ordersGrid";
import { useContext, useEffect } from "react";
import { SocketContext } from "../ApiContext/socketContext";

const ORDERS = [
  {
    title: "Order #1001",
    model: "Food",
    ingredients: "No sugar",
    data: [
      {
        name: "Latte",
        description: "Oat milk",
        price: "40",
        quantity: "2",
      },
    ],
  },
  {
    title: "Order #1002",
    model: "Food",
    ingredients: "Extra cheese",
    data: [
      {
        name: "Burger",
        description: "No onion",
        price: "80",
        quantity: "1",
      },
    ],
  },
];

export default function BusinessOrders() {
  const { socketRef, connected } = useContext(SocketContext);
  const [orders, setOrders] = useState(ORDERS);

  useEffect(() => {
    if (!socketRef?.current) return;

    const handleNewOrder = (order, ack) => {
      //alert("Ny ordre modtaget! Tjek ordreliste.");
      console.log("New order received:", order);
      setOrders(prevOrders => [...prevOrders, order]);
      if (ack) ack({ success: true });
    };

    socketRef.current.on("new-order", handleNewOrder);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-order", handleNewOrder);
      }
    };
  }, [socketRef]); // ✅ correct dependency

  return (
    <main className={styles.main}>
      <p>Socket Status: {connected ? "Connected" : "Disconnected"}</p>
      <OrdersGrid orders={orders} />
    </main>
  );
}