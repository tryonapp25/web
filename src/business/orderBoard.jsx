import styles from "../styles/OrderBoard.module.css";
import Sidebar from "../components_business/businessSidebar";
import OrdersGrid from "../components_business/ordersGrid";

const orders = [
  {
    title:"Order #1001",
    model:"Food",
    ingredients:"No sugar",
    data: [
      {
        name:"Latte",
        description:"Oat milk",
        price:"40",
        quantity:"2"
      }
    ]
  },
  {
    title:"Order #1002",
    model:"Food",

    ingredients:"Extra cheese",

    data:[
      {
        name:"Burger",
        description:"No onion",
        price:"80",
        quantity:"1"
      }
    ]
  }

];

export default function OrderBoard(){

return (
  <div className={styles.shell}>
    <Sidebar />

    <main className={styles.main}>
      <OrdersGrid orders={orders} />
    </main>
  </div>
)

}