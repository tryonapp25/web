import styles from "../styles/QuickActions.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ApiContext/userContext";
import FlashMessage from "../components/flashMessage";

const actions = [
  /* {name: "Personal Stylish", navigation: "/personalStylish"},
  {name: "TryOn Preview", navigation: "/tryon"}, */
  {name: "TryOn Preview", navigation: "/tryon"}
];


export default function QuickActions() {
  const navigate = useNavigate();
  const { publicUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState();

  const handleQuickAction = (a) => {
    if(publicUser?.poses.length === 0){
      setMessage("You need to generate your pose before AI can style.");
      setShowMessage(true);
      return;
    }
    navigate(a.navigation)
  }
  return (
    <section className={styles.row}>
      {actions.map((a) => (
        <button key={a} className={styles.card} onClick={() => handleQuickAction(a)}>
          {a.name}
        </button>
      ))}

      <FlashMessage show={showMessage} message={message} type="alert" onClose={() => {setMessage(""), setShowMessage(false)}}/>
    </section>
  );
}
