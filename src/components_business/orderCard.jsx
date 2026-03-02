import styles from "../styles/OrderCard.module.css";
import Model3D from "../components/3dModel";
import { getStatusColor } from "./index";
import { useState, useEffect } from "react";

const config = {
  camera_orbit: "auto 70deg",
}

function formatWaitingTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export default function OrderCard({ order, onSelected }) {
  const [waitingTime, setWaitingTime] = useState(0);
  useEffect(() => {
    if (order.status !== "READY") {
      setWaitingTime(0);
      return;
    }

    // Calculate initial waiting time from updatedAt
    const startTime = order.updatedAt ? new Date(order.updatedAt).getTime() : Date.now();
    
    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setWaitingTime(elapsed);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [order.status, order.updatedAt]);


  return (
    <div className={styles.card} onClick={() => onSelected(order)}>
      {/* Order Header */}
      <div className={styles.header}>
        <div className={styles.orderNumber}>
          #{order.id}
        </div>
        <div className={styles.status} style={{backgroundColor: getStatusColor(order.status)}}>
          {order.status}
        </div>
      </div>

      {/* Waiting Timer for READY orders */}
      {order.status === "READY" && (
        <div className={styles.waitingTimer}>
          <span className={styles.waitingIcon}>⏱️</span>
          <span className={styles.waitingText}>Waiting for pickup:</span>
          <span className={styles.waitingTime}>{formatWaitingTime(waitingTime)}</span>
        </div>
      )}
      {/* Items */}

      <div className={styles.items}>

        {order.data.map((item, index) => (
          <div key={index} className={styles.item}>
            <div style={{flex:1}}>
              <div className={styles.name}>
                {item?.data[0]?.name} - {item.title}
              </div>
              <p className={styles.description}>
                {item?.data[0]?.price}{order?.currency ? ` ${order.currency}` : ''}
              </p>
              {/* <div className={styles.model3d} style={{width:"100%",height:"80px", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{width:"50%", height:"100%"}}>
                  <Model3D model={item?.model} config={config} images={item?.images} />
                </div>
                <div>
                  <p>
                    Price: {item?.data[0]?.price}
                  </p>
                </div>
              </div> 
              <div className={styles.description}>
                {item.description}
              </div> 
              */}
              {item?.ingredients && item?.ingredients?.length > 0 && 
                <div className={styles.ingredients}>
                  {item?.ingredients?.map((ingredient, index) => (
                    <span key={index} style={{paddingLeft:"8px"}}>{ingredient.name} <span> {ingredient?.included ? "✓" : "✗"}</span></span>
                  ))}
                </div>
              }
              {item?.extras && item?.extras?.length > 0 && (
                <div className={styles.extras}>
                  <h4>Extras:</h4>
                  {item?.extras.map((extra, index) => (
                    <div key={index} className={styles.extra}>
                      <p>{extra?.category}</p>
                      <div>
                        <div className={styles.name}>{extra.name}</div>
                        <div className={styles.meta}>
                          {extra.category && <span className={styles.category}>{extra.category}</span>}
                          {typeof extra.price !== "undefined" && (
                            <span className={styles.price}>{extra.price}{order?.currency ? ` ${order.currency}` : ''}</span>
                          )}
                          {extra.description && <span className={styles.description}>{extra.description}</span>}
                        </div>
                      </div>
                      <div className={styles.qty}>x{extra.quantity}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.qty}>
              x{item.quantity}
            </div>
          </div>
        ))}
        {order?.totalPrice && (
          <div className={styles.totalPrice}>
            Total: {order.totalPrice} {order?.currency}
          </div>
        )}
      </div>


    </div>
  );
}