import styles from "./POST01.module.css";



export default function Template({ data }) {
  const d = data;

  const posterStyle = {
    background: `radial-gradient(circle at 50% 30%, ${d.bgColor}44 0%, ${d.bgColor}cc 40%, ${d.bgColor} 100%)`,
    color: d.textColor,
  };

  const kickerStyle = { color: d.accentColor };
  const badgeStyle = { 
    background: d.accentColor, 
    transform: `rotate(${d.badgeRotation}deg)` 
  };
  const infoStyle = { color: d.mutedColor };
  const websiteStyle = { color: d.accentColor };
  const plateStyle = { 
    width: d.plateSize, 
    height: d.plateSize 
  };

  return (
    <div className={styles.page}>
      <div className={styles.poster} style={posterStyle}>

        {/* top */}
        <p className={styles.kicker} style={kickerStyle}>{d.kicker}</p>

        <h1 className={styles.title}>{d.title}</h1>

        {/* plate */}
        <div className={styles.plateWrap}>
          <div className={styles.plate} style={plateStyle}>
            <img
              src={d.imageUrl}
              className={styles.food}
              alt=""
            />
          </div>
        </div>

        {/* badge */}
        <div className={styles.badge} style={badgeStyle}>
          <span>{d.badgeSmall}</span>
          <b>{d.badgeLarge}</b>
        </div>

        {/* info */}
        <div className={styles.info} style={infoStyle}>
          <p>{d.hours}</p>
          <p>{d.address}</p>
          <p>{d.phone}</p>
        </div>

        <p className={styles.website} style={websiteStyle}>
          {d.website}
        </p>

      </div>
    </div>
  );
}
