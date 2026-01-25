import { useEffect } from "react";
import "../styles/FlashMessage.css";

export default function FlashMessage({ show, type = "success", message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`flash flash-${type}`}>
      {message}
    </div>
  );
}
