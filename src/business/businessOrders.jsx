import styles from "../styles/OrderBoard.module.css";
import OrdersGrid from "../components_business/ordersGrid";
import { useContext, useEffect, useState } from "react";
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

const newOrder = {
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
};

export default function BusinessOrders() {
  const { socketRef, connected } = useContext(SocketContext);
  const [orders, setOrders] = useState(ORDERS);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const handleNewOrder = (order, ack) => {
      //alert("Ny ordre modtaget! Tjek ordreliste.");
      console.log("Received new order:", order);
      setOrders((prev) => [newOrder, ...prev]);
      if (ack) ack({ success: true });
    };

    // server-side/sendOrder uses `new_order` (underscore)
    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [socketRef?.current, connected]);

  return (
    <main className={styles.main}>
      <p>Socket Status: {connected ? "Connected" : "Disconnected"}</p>
      <OrdersGrid orders={orders} />
    </main>
  );
}