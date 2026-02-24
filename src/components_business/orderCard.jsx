import styles from "../styles/OrderCard.module.css";

export default function OrderCard({ order }) {

  return (
    <div className={styles.card}>

      {/* Order Header */}

      <div className={styles.header}>

        <div className={styles.orderNumber}>
          {order.title}
        </div>

        <div className={styles.model}>
          {order.model}
        </div>

      </div>


      {/* Items */}

      <div className={styles.items}>

        {order.data.map((item, index) => (

          <div key={index} className={styles.item}>

            <div>

              <div className={styles.name}>
                {item.name}
              </div>

              <div className={styles.description}>
                {item.description}
              </div>

            </div>

            <div className={styles.qty}>
              x{item.quantity}
            </div>

          </div>

        ))}

      </div>


      {/* Ingredients / extras */}

      {order.ingredients && (

        <div className={styles.ingredients}>

          {typeof order.ingredients === "string"
            ? order.ingredients
            : JSON.stringify(order.ingredients)
          }

        </div>

      )}

    </div>
  );
}