import styles from "../styles/ExploreTabs.module.css";
import { useEffect, useContext } from "react";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";

export default function ExploreTabs({onSubmit}) {
  const { publicUser, setPublicUser } = useContext(UserContext);

  useEffect(()=> {
    getHistoryGenerations()
  },[])
  
  const getHistoryGenerations = async() => {
    try{
      const res = await http.get(`/history/image-generation/user/${publicUser?.uid}`);
      if(res.data.success){
        onSubmit({
          id: "history",
          data: res.data.data || []
        });
      }
    }
    catch(err){
      console.log(err);
    }
  }

  const getUserPoses = async() => {
    onSubmit({
      id: "poses",
      data: publicUser?.poses || []
    })
  }
  
  return (
    <div className={styles.tabs}>
      <button className={styles.active} onClick={() => getHistoryGenerations()}>Recent generations</button>
      <button onClick={() => getUserPoses()}>My avatar</button>
      <button>My Closet</button>
    </div>
  );
}
