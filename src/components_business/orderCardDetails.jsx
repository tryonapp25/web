import styles from "../styles/OrderCardDetails.module.css";
import Model3D from "../components/3dModel";
import { getStatusColor } from "./index";

const config = {
  camera_orbit: "auto 70deg",
}

export default function OrderCardDetails({ order }) {


  return (
    <div className={styles.card}>
      {/* Order Header */}
      <div className={styles.header}>
        <div className={styles.orderNumber}>
          #{order.id}
        </div>
        <div className={styles.status} style={{backgroundColor: getStatusColor(order.status)}}>
          {order.status}
        </div>
      </div>
      {/* Items */}

      <div className={styles.items}>

        {order.data.map((item, index) => (

          <div key={index} className={styles.item}>
            <div style={{flex:1}}>
              <div className={styles.name}>
                {item?.data[0]?.name} - {item.title}
              </div>
              <p className={styles.description}>
                {item?.data[0]?.description}
              </p>
              <div className={styles.model3d} style={{width:"100%", height:"200px", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{width:"100%", height:"100%"}}>
                  <Model3D model={item?.model} config={config} images={item?.images} />
                </div>
                <div>
                  <p>
                    Price: {item?.data[0]?.price} {order?.currency}
                  </p>
                </div>
              </div>
              <div className={styles.description}>
                {item.description}
              </div>
              <div className={styles.ingredients}>
                {item?.ingredients?.map((ingredient, index) => (
                  <span key={index} style={{paddingLeft:"8px"}}>{ingredient.name} <span> {ingredient?.included ? "✓" : "✗"}</span></span>
                ))}
              </div>
            </div>
            <div className={styles.qty}>
              x{item.quantity}
            </div>
          </div>
        ))}
      </div>
      {/* extras */}

    </div>
  );
}