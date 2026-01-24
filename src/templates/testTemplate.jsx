import styles from "./TestTemplate.module.css";
import Model3D from "../components/3dModel";

export default function TestTemplate({ data = [], pressable, onPress }) {
  const { contents, heading, subheading } = data;

  return (
   
      <div className={styles.page}>
        <button className={styles.editBtn} type="button">
          Edit
        </button>

        <header className={styles.header}>
          <h1 className={styles.pizza}>{heading}</h1>
          <div className={styles.menu}>{subheading}</div>
        </header>

        <section className={styles.grid}>
          {contents.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className={styles.item}
              data-col={(idx % 3) + 1}
            >
              <div className={styles.imageWrap}>
                <Model3D model={item.model}/>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>{item.title}</div>

                <div className={styles.rows}>
                  {item.data.map((row) => (
                    <div key={row.name} className={styles.row}>
                      <div className={styles.left}>
                        <span className={styles.bullet}>•</span>
                        <span className={styles.size}>{row.name}</span>
                      </div>
                      <div className={styles.price}>{row.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

  );
}
