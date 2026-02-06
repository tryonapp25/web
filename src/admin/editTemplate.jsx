import React, { useMemo, useState, lazy, Suspense, useEffect } from "react";
import JSON5 from "json5";
import styles from "../styles/CreateTemplate.module.css";
import PdfPageWrapper from "../components/pdfPageWrapper";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";



const files = import.meta.glob("../templates/menu/*.jsx");
const jsxFileList = Object.keys(files).map(path =>
  path.split("/").pop()
);


const defaultText = `{
    id: 10,
    category: "",
    code: "", // template name
    type: "demo" ,
    name: "ala-carte-sushi",
    heading: "A LA CARTE",
    subheading: "SUSHI AND SASHIMI",
    contents: []
}`

function removeJsxExtension(filename) {
  return filename.replace(/\.jsx$/, "");
}

const defaultMessage = {visible: false, type:"", msg:""};

export default function EditTemplate() {
  const [text, setText] = useState(defaultText);
  const [message, setMessage] = useState(defaultMessage);
  const [selected, setSelected] = useState(jsxFileList[0] || "ABCD12.jsx");
  const Template = lazy(() => import(`../templates/menu/${selected}`));



  useEffect(() => {
    getTemplateDataByCode(removeJsxExtension(selected));
  }, [selected]);

  const getTemplateDataByCode = async (code) => {
    try{
      const res = await http.get(`/admin/demo/templates/code/${code}`);
      if(res.data.success){
        setText(JSON.stringify(res.data.data, null, 2));
      }
    }
    catch(err){
      setMessage(httpMessage(err));
    }
  }

  const { parsedData, error } = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return { parsedData: null, error: null };

    try {
      return { parsedData: JSON5.parse(trimmed), error: null };
    } catch (e) {
      return { parsedData: null, error: "Invalid JSON / JS object" };
    }
  }, [text]);


  const handleCreateTemplate = async () => {
    if(!parsedData?.code || parsedData?.code === "") return setMessage({visible: true, type:"warn", msg:"Template missing code"});
    if(!parsedData?.category || parsedData?.category === "") return setMessage({visible: true, type:"warn", msg:"Template missing category"});
    if(!parsedData?.type || parsedData?.type === "") return setMessage({visible: true, type:"warn", msg:"Template missing type"});
    if(!parsedData?.price) return setMessage({visible: true, type:"warn", msg:"Template missing price"});
    try{
      const res = await http.post(`/admin/demo/create/template`, parsedData);
      if(res.data.success){
        setMessage({visible: true, type: "success", msg: res.data.message});
      }
    }
    catch(err){
      setMessage(httpMessage(err));
    }
  }

  const handleUpdateTemplate = async () => {
    if(!parsedData?.code || parsedData?.code === "") return setMessage({visible: true, type:"warn", msg:"Template missing code"});
    if(!parsedData?.category || parsedData?.category === "") return setMessage({visible: true, type:"warn", msg:"Template missing category"});
    if(!parsedData?.type || parsedData?.type === "") return setMessage({visible: true, type:"warn", msg:"Template missing type"});
    if(!parsedData?.price) return setMessage({visible: true, type:"warn", msg:"Template missing price"});
    try{
      const res = await http.put(`/admin/demo/templates`, parsedData);
      if(res.data.success){
        setMessage({visible: true, type: "success", msg: res.data.message});
      }
    }
    catch(err){
      setMessage(httpMessage(err));
    }
  }

  

  return (
    <div className={styles.page}>
      {/* LEFT PANEL */}
      <aside className={styles.left}>

        {/* SELECTION TEMPLATES*/}
        <select onChange={e => setSelected(e.target.value)}>
        <option value={selected}>{selected}</option>
          {jsxFileList.map(file => (
            <option key={file} value={file} selected={file === selected}>{file}</option>
          ))}
        </select>


        <h2 className={styles.title}>Create (JSON / JS Object)</h2>

        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />

        <div className={styles.hint}>
          {error ? <span className={styles.error}>{error}</span> : "Valid ✔"}
        </div>
        {(error || parsedData) && (
          <div className={styles.buttonGroup}>
            <button className={styles.primary} onClick={handleCreateTemplate}>Create Template</button>
            <button className={styles.secondary} onClick={handleUpdateTemplate}>Update Template</button>
          </div>
        )}
      </aside>

      {/* RIGHT PANEL */}
      <main className={styles.right}>
        <div className={styles.preview}>
          <PdfPageWrapper>
            {parsedData ? (
              <Suspense fallback={<div>Loading…</div>}>
                <Template data={parsedData} />
              </Suspense>
            ) : null}
          </PdfPageWrapper>
        </div>
      </main>

      <FlashMessage show={message.visible} type={message.type} message={message.msg}/>
    </div>
  );
}
