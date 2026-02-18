import styles from "./REST02.module.css";
import Model3D from "../../components/3dModel";


const config = { camera_orbit: "auto 55deg" };

function Item({ item, variant = "normal", onClick }) {
  if (!item) return null;
  
  const name = item.title;
  const de = item.description;
  const th = item.data?.[0]?.description || "";
  const price = item.data?.[0]?.price || "";
  const model = item.model;

  return (
    <article className={`${styles.card} ${variant === "hero" ? styles.hero : ""}`} onClick={onClick}>
      <div className={styles.photo}>
        <Model3D model={model} config={config} images={item?.images} />
      </div>

      <div className={styles.text}>
        <div className={styles.titleRow}>
          <span className={styles.bullet}>•</span>
          <h3 className={styles.itemName}>{name}</h3>
        </div>

        <div className={styles.meta}>
          <div className={styles.de}>{de}</div>
          <div className={styles.th}>{th}</div>
        </div>

        <div className={styles.priceRow}>
          <div className={styles.dots} />
          <div className={styles.price}>
            {price} <span className={styles.thb}>THB.</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Template({ data = {}, pressable, onPress, onClickModel }) {
  const {contents, heading, subheading, extras} = data;

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  return (
    <div className={styles.screen} onClick={onSelectedTemplate}>
      <div className={styles.page}>
        {/* bunting */}
        <div className={styles.flags} aria-hidden="true">
          <span className={`${styles.flag} ${styles.f1}`} />
          <span className={`${styles.flag} ${styles.f2}`} />
          <span className={`${styles.flag} ${styles.f3}`} />
          <span className={`${styles.flag} ${styles.f4}`} />
          <span className={`${styles.flag} ${styles.f5}`} />
        </div>

        <header className={styles.header}>
          <h1 className={styles.mainTitle}>{heading}</h1>
          <p className={styles.subTitle}>{subheading}</p>
        </header>

        {/* DESKTOP/TABLET GRID (no overlap) */}
        <main className={styles.desktopGrid}>
          {contents.map((item, index) => {
            const gridAreas = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
            const areaClass = styles[gridAreas[index]] || '';
            const isHero = index === contents.length - 1;
            return (
              <div key={index} className={areaClass}>
                <Item item={item} variant={isHero ? "hero" : "normal"} onClick={() => onClickModel({data: item, config: config})} />
              </div>
            );
          })}
        </main>

        {/* MOBILE STACK (always clean) */}
        <main className={styles.mobileStack}>
          {contents.map((item, index) => (
            <Item 
              key={index} 
              item={item} 
              variant={index === contents.length - 1 ? "hero" : "normal"} 
              onClick={() => onClickModel({data: item, config: config})} />
          ))}
        </main>

        {/* EXTRAS SECTION */}
        {extras && extras.length > 0 && (
          <section className={styles.extrasSection}>
            {extras.map((category, catIndex) => (
              <div key={catIndex} className={styles.extrasCategory}>
                <h2 className={styles.extrasTitle}>{category.title}</h2>
                {category.description && (
                  <p className={styles.extrasDescription}>{category.description}</p>
                )}
                <div className={styles.extrasGrid}>
                  {category.data?.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.extraItem}>
                      <div className={styles.extraItemRow}>
                        <span className={styles.extraBullet}>◆</span>
                        <span className={styles.extraName}>{item.name}</span>
                        <span className={styles.extraDots} />
                        <span className={styles.extraPrice}>{item.price}</span>
                      </div>
                      {item.description && (
                        <p className={styles.extraItemDesc}>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
