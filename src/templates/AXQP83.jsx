import styles from "./AXQP83.module.css";
import { useState } from "react";
import Model3D from "../components/3dModel";
import TemplateEditor from "./templateEditor";
import EditButton from "../components/editButton";


export default function Template({ data = [], pressable, onPress, editable = false }) {
  const [template, setTemplate] = useState(data || [])
  const { subheading, heading, contents } = template;
  const [onEdit, setOnEdit] = useState(false);

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  const handleUpdateTemplate = async (data) => {
    setTemplate(data);
    setOnEdit(false);
  }

  if(onEdit) return <TemplateEditor data={data} onChange={(d) => handleUpdateTemplate(d)}/>

  return (
      <div className={styles.page} onClick={onSelectedTemplate}>
        {editable && <EditButton onClick={() => setOnEdit(true)}/>}

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
