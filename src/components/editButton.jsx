import { useState } from "react";

export default function EditButton({onClick, text = "Edit"}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const styles = {
    button: {
      position: "absolute",
      top: "clamp(12px, 1.6cqh, 24px)",
      right: "clamp(12px, 1.6cqw, 24px)",
      zIndex: 10,

      borderRadius: "12px",
      border: hover
        ? "1px solid rgba(255,255,255,.22)"
        : "1px solid rgba(255,255,255,.14)",

      background: hover
        ? "rgba(255,255,255,.10)"
        : "rgba(255,255,255,.06)",

      color: "rgba(255,255,255,.88)",

      padding: "8px 12px",
      fontSize: "12px",
      fontWeight: 800,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      cursor: "pointer",
      backdropFilter: "blur(8px)",

      transform: active ? "scale(.97)" : "scale(1)",
      transition:
        "transform .12s ease, background .2s ease, border-color .2s ease",
    
    },
  };

  return (
    <button
      style={styles.button}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onClick={() => onClick()}
    >
      {text}
    </button>
  );
}
