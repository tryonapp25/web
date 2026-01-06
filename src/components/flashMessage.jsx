import { useEffect } from "react";
import "../styles/FlashMessage.css";

export default function FlashMessage({ show, type, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
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
