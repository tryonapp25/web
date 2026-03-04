export function FreeBadge() {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #FFF176, #FFD54F)",
    color: "#000",
    fontWeight: "700",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    border: "1px solid #e6c200",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const iconStyle = {
    fontSize: "12px",
  };

  return (
    <div style={style}>
      <span style={iconStyle}>⭐</span>
      Free
    </div>
  );
}


export  function PayBadge({ price = 0 }) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #FFD700, #FFB300)",
    color: "#000",
    fontWeight: "700",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    border: "1px solid #e6b800",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const iconStyle = {
    fontSize: "12px",
  };

  return (
    <div style={style}>
      <span style={iconStyle}>🪙</span>
      {`${price.toFixed(0)}`} {price === 1 ? "token" : "tokens"}
    </div>
  );
}