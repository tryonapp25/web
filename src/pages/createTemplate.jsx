import React, { useMemo, useState } from "react";
import JSON5 from "json5";
import styles from "../styles/CreateTemplate.module.css";
import PdfPageWrapper from "../components/pdfPageWrapper";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";

import Template from "../templates/TYPK10";


  const data = {
  id: 10,
  category: "sushi",
  name: "ala-carte-sushi",
  code:"TYPK10",
  type:"demo",
  heading: "A LA CARTE",
  subheading: "SUSHI AND SASHIMI",

  contents: [
    {
      title: "Octopus",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi1.glb_65291daa-8aee-4640-a172-785e17c49854.glb?alt=media&token=921c924b-4078-4554-a757-30b3f6b76c44",
      data: [{ name: "2 pcs", price: "$6.25" }]
    },
    {
      title: "Squid",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi2.glb_21a5d555-78be-4814-9ccc-1698f9adb0d3.glb?alt=media&token=4f3326d9-67b4-4845-a8af-861820a2311c",
      data: [{ name: "2 pcs", price: "$5.95" }]
    },
    {
      title: "Eel",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi3.glb_01e0a7c8-baf3-41d9-90ca-dd82b59f7cd7.glb?alt=media&token=4f33a600-54f4-47f6-88ac-fa581206c390",
      data: [{ name: "2 pcs", price: "$6.85" }]
    },
    {
      title: "Cheese Salmon",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi4.glb_38fcee91-da50-482f-9d4b-7097bd7712e8.glb?alt=media&token=865cb6e0-a0f4-48d8-98ed-6cc194b203c0",
      data: [{ name: "2 pcs", price: "$6.95" }]
    },
    {
      title: "Cheese Shrimp",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi1.glb_65291daa-8aee-4640-a172-785e17c49854.glb?alt=media&token=921c924b-4078-4554-a757-30b3f6b76c44",
      data: [{ name: "2 pcs", price: "$6.25" }]
    },
    {
      title: "Snowflake Salmon",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi2.glb_21a5d555-78be-4814-9ccc-1698f9adb0d3.glb?alt=media&token=4f3326d9-67b4-4845-a8af-861820a2311c",
      data: [{ name: "2 pcs", price: "$6.95" }]
    },

    {
      title: "Spicy Tuna",
     model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi3.glb_01e0a7c8-baf3-41d9-90ca-dd82b59f7cd7.glb?alt=media&token=4f33a600-54f4-47f6-88ac-fa581206c390",
      data: [{ name: "2 pcs", price: "$6.25" }]
    },
    {
      title: "Spicy Salmon",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi4.glb_38fcee91-da50-482f-9d4b-7097bd7712e8.glb?alt=media&token=865cb6e0-a0f4-48d8-98ed-6cc194b203c0",
      data: [{ name: "2 pcs", price: "$6.25" }]
    },
    {
      title: "Salmon Roe",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi1.glb_65291daa-8aee-4640-a172-785e17c49854.glb?alt=media&token=921c924b-4078-4554-a757-30b3f6b76c44",
      data: [{ name: "2 pcs", price: "$6.55" }]
    },
    {
      title: "Flying Fish Roe",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi2.glb_21a5d555-78be-4814-9ccc-1698f9adb0d3.glb?alt=media&token=4f3326d9-67b4-4845-a8af-861820a2311c",
      data: [{ name: "2 pcs", price: "$5.55" }]
    },

    {
      title: "Baked Crab Stick",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi3.glb_01e0a7c8-baf3-41d9-90ca-dd82b59f7cd7.glb?alt=media&token=4f33a600-54f4-47f6-88ac-fa581206c390",
      data: [{ name: "2 pcs", price: "$5.95" }]
    },
    {
      title: "Tamago",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi4.glb_38fcee91-da50-482f-9d4b-7097bd7712e8.glb?alt=media&token=865cb6e0-a0f4-48d8-98ed-6cc194b203c0",
      data: [{ name: "2 pcs", price: "$4.55" }]
    },
    {
      title: "Shrimp Tamago",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi1.glb_65291daa-8aee-4640-a172-785e17c49854.glb?alt=media&token=921c924b-4078-4554-a757-30b3f6b76c44",
      data: [{ name: "2 pcs", price: "$6.25" }]
    },
    {
      title: "Tofu",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi2.glb_21a5d555-78be-4814-9ccc-1698f9adb0d3.glb?alt=media&token=4f3326d9-67b4-4845-a8af-861820a2311c",
      data: [{ name: "2 pcs", price: "$4.55" }]
    },

    {
      title: "Crab Meat",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi3.glb_01e0a7c8-baf3-41d9-90ca-dd82b59f7cd7.glb?alt=media&token=4f33a600-54f4-47f6-88ac-fa581206c390",
      data: [{ name: "2 pcs", price: "$4.55" }]
    },
    {
      title: "Avocado",
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fsushi4.glb_38fcee91-da50-482f-9d4b-7097bd7712e8.glb?alt=media&token=865cb6e0-a0f4-48d8-98ed-6cc194b203c0",
      data: [{ name: "2 pcs", price: "$4.55" }]
    }
  ],
};


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

const defaultMessage = {visible: false, type:"", msg:""}
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
    try{
      const res = await http.post(`/create/template`, parsedData);
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
            {parsedData ? <Template data={parsedData} /> : null}
          </PdfPageWrapper>
        </div>
      </main>

      <FlashMessage show={message.visible} type={message.type} message={message.msg}/>
    </div>
  );
}
