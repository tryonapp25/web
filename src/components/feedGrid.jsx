import { useEffect, useState } from "react";
import styles from "../styles/FeedGrid.module.css";
import { UserContext } from "../ApiContext/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./confirmDialog";
import PreviewImage from "./previewImage";


export default function FeedGrid({ data = {}, onDelete, addMore}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const { publicUser} = useContext(UserContext);
  const [selectedItem, setSelectItem] = useState(null);
  const [selectedImageUrl, setSelectImageUrl] = useState(null);


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
            onClick={() => setSelectImageUrl(item.img)}
          />
          <div className={styles.meta}>
            <span>Creator</span>
            <span>❤️ {100 + index * 7}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.deleteButton} onClick={() => setSelectItem({id: data?.id, data: item})}>Delete</button>
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
      
      <PreviewImage initialUrl={selectedImageUrl} isOpen={!selectedImageUrl ? false : true} onClose={() => setSelectImageUrl(null)} onSave={() => setSelectImageUrl(null)} showSave={false}/>
      <ConfirmDialog open={!selectedItem ? false : true} onCancel={() => setSelectItem(null)} onConfirm={() => {onDelete(selectedItem), setSelectItem(null)}} variant="danger"/>
    </section>
  );
}

