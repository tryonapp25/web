import React, { useMemo, useState, lazy, Suspense } from "react";
import JSON5 from "json5";
import styles from "../styles/CreateTemplate.module.css";
import PdfPageWrapper from "../components/pdfPageWrapper";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";

const Template = lazy(() => import("../templates/menu/BBMN07.jsx"));


const defaultText = `{
    id: 10,
    category: "",
    code: "", // template name
    type: "demo" 
    name: "ala-carte-sushi",
    heading: "A LA CARTE",
    subheading: "SUSHI AND SASHIMI",
    contents: []
}`

const defaultMessage = {visible: false, type:"", msg:""};

export default function CreateTemplate() {
  const [text, setText] = useState(defaultText);

  const [message, setMessage] = useState(defaultMessage);

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

  return (
    <div className={styles.page}>
      {/* LEFT PANEL */}
      <aside className={styles.left}>
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
        {error || parsedData && <button onClick={handleCreateTemplate}>Create Template</button>}
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
