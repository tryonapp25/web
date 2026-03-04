import React, { Suspense } from "react";
import styles from "../styles/CloseBubble.module.css";
const Lottie = React.lazy(() => import("lottie-react"));
import closeTag from "../assets/lottiefiles/closed_tag.json";

export default function CloseBubble({ count = 0, onClick }) {
  return (
    <button className={styles.closeBubble} onClick={onClick} aria-label="Close">
      <Suspense fallback={<div style={{width:24,height:24}} />}>
        <Lottie 
          animationData={closeTag}
          loop={true}
          autoplay={true}
          style={{width:"100%", height:"100%"}}
        />
      </Suspense>
    </button>
  );
}