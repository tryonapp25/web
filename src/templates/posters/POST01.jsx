import styles from "./POST01.module.css";
import Model3D from "../../components/3dModel";

const config = {
  camera_orbit: "auto 60deg",
}


export default function Template({ data }) {
  const d = data;
  const info = d.information || {};
  const more = info.more || {};
  const firstContent = d.contents?.[0] || {};

  const posterStyle = {
    background: `radial-gradient(circle at 50% 30%, ${more.bgColor}44 0%, ${more.bgColor}cc 40%, ${more.bgColor} 100%)`,
    color: more.textColor,
  };

  const kickerStyle = { color: more.accentColor };
  const badgeStyle = { 
    background: more.accentColor, 
    transform: `rotate(${more.badgeRotation}deg)` 
  };
  const infoStyle = { color: more.mutedColor };
  const websiteStyle = { color: more.accentColor };
  const plateStyle = { 
    width: more.plateSize, 
    height: more.plateSize 
  };

  return (
    <div className={styles.page}>
      <div className={styles.poster} style={posterStyle}>

        {/* top */}
        <p className={styles.kicker} style={kickerStyle}>{d.subheading}</p>

        <h1 className={styles.title}>{d.heading}</h1>

        {/* plate */}
        <div className={styles.plateWrap}>
          <div className={styles.plate} style={plateStyle}>
            <Model3D model={firstContent.model} config={config} images={firstContent?.images} />
          </div>
        </div>

        {/* badge */}
        <div className={styles.badge} style={badgeStyle}>
          <span>{more.badgeSmall}</span>
          <b>{more.badgeLarge}</b>
        </div>

        {/* info */}
        <div className={styles.info} style={infoStyle}>
          <p>{more.hours}</p>
          <p>{info.address}</p>
          <p>{info.phone}</p>
        </div>

        <p className={styles.website} style={websiteStyle}>
          {info.website}
        </p>

      </div>
    </div>
  );
}
