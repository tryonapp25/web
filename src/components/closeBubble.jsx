import React from "react";
import styles from "../styles/CloseBubble.module.css";
import Lottie from "lottie-react";
import closeTag from "../assets/lottiefiles/closed_tag.json";

export default function CloseBubble({ count = 0, onClick }) {
  return (
    <button className={styles.closeBubble} onClick={onClick} aria-label="Close">
      <Lottie 
        animationData={closeTag}
        loop={true}
        autoplay={true}
        style={{width:"100%", height:"100%"}}
      />
    </button>
  );
}