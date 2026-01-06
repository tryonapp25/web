import { useEffect, useState } from "react";
import styles from "../styles/FeedGrid.module.css";
import { UserContext } from "../ApiContext/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


export default function FeedGrid({ data = {}, onDelete, addMore}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const { publicUser} = useContext(UserContext);
  useEffect(()=> {  
    setItems(data?.data || []);
  },[data])
  

  const handleAddmoreButton = () => {
    if(publicUser?.poses.length === 0){
      navigate("/createPoses");
      return
    };
    addMore({id: data?.id, data: items})
  }

  return (
    <section className={styles.grid}>
      {items.map((item, index) => (
        <div key={index} className={styles.card}>
          <img
            src={item.img}
            alt={item.alt || ""}
          />
          <div className={styles.meta}>
            <span>Creator</span>
            <span>❤️ {100 + index * 7}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.deleteButton} onClick={() => onDelete({id: data?.id, data: item})}>Delete</button>
          </div>
        </div>
      ))}
      {data?.id != "history" ?
        <button className={styles.addmore} onClick={() => handleAddmoreButton()}>
          <p style={{color:"#333"}}>Add More</p>
        </button>
        : 
        null
      }
    </section>
  );
}

