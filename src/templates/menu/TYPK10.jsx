import { useEffect, useState } from "react";
import style from "./TYPK10.module.css";
import Model3D from "../../components/3dModel";
import EditButton from "../../components/editButton";
import TemplateEditor from "./templateEditor";

export default function Template({ data = [], pressable, onPress, editable = false, onClickModel  }) {
  const [template, setTemplate] = useState(data)
  const [onEdit, setOnEdit] = useState(false);


  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  const handleUpdateTemplate = async (data) => {
      setTemplate(data);
      setOnEdit(false);
    }
  
  if(onEdit) return <TemplateEditor data={template} onChange={(d) => handleUpdateTemplate(d)}/>

  return (
    <div className={style.page} onClick={onSelectedTemplate}>
      <header className={style.header}>
        {editable && <EditButton onClick={() => setOnEdit(true)}/>}
        <h1 className={style.heading}>{template?.heading}</h1>

        <div className={style.subWrap}>
          <div className={style.brush} />
          <div className={style.subheading}>{template?.subheading}</div>
        </div>

        <p className={style.note}>
          (2 pcs of sushi or sashimi per order)
        </p>
      </header>

      <main className={style.grid}>
        {template.contents.map((item, i) => {
          const firstLine = item.template?.[0]; // { name: "2 pcs", price: "$6.25" }

          return (
            <div key={i} className={style.card}>
              <div className={style.imageWrap}>
                <Model3D model={item.model}  onClick={() => onClickModel(item)}/>
              </div>

              <div className={style.name}>{item.title}</div>

              {/* show price */}
              <div className={style.price}>{firstLine?.price}</div>

              {/* if you also want "2 pcs" shown, uncomment:
              <div className={style.note}>{firstLine?.name}</div>
              */}
            </div>
          );
        })}
      </main>
    </div>
  );
}



