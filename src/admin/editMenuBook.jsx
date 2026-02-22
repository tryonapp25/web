import React, { useMemo, useState, lazy, Suspense, useEffect } from "react";
import JSON5 from "json5";
import styles from "../styles/CreateTemplate.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";
import PdfPageWrapper from "../components/pdfPageWrapper";

const files = import.meta.glob("../templates/menuBooks/*.jsx");

// filenames without extension
const jsxFileList = Object.keys(files).map((path) =>
  path.split("/").pop().replace(/\.jsx$/, "")
);

function removeJsxExtension(filename) {
  return filename.replace(/\.jsx$/, "");
}

const defaultText = `
    {
      "id": 14,
      "uid": 5,
      "isPublic": false,
      "publicCode": {
          "String": "",
          "Valid": false
      },
      "price": 2,
      "category": "menubook",
      "type": "demo",
      "heading": "Welcome to Our Menu Book",
      "subheading": "menu",
      "templateCode": "ABCD12",
      "menuBookCode": "DEFAULT",
      "information": {
          "email": "",
          "phone": "",
          "address": ""
      },
      "contents": []
    }
`;

const defaultMessage = { visible: false, type: "", msg: "" };

export default function EditMenuBook() {
  const [text, setText] = useState(defaultText);
  const [message, setMessage] = useState(defaultMessage);
  const [selected, setSelected] = useState(jsxFileList[0]);
  const [showDefault, setShowDefault] = useState(false);


  useEffect(() => {
    if(!selected) return;
    const code = removeJsxExtension(selected);
    if(showDefault){
      getDefaultTemplateDataByCode(code);
    }else{
      getTemplateDataByCode(code);
    }
  }, [selected, showDefault]);

  const getTemplateDataByCode = async (code) => {
    try{
      const res = await http.get(`/admin/demo/menu-book/code/${code}`);
      if(res.data.success){
        setText(JSON.stringify(res.data.data, null, 2));
      }
    }
    catch(err){
      setMessage(httpMessage(err));
    }
  }

  const getDefaultTemplateDataByCode = async (code) => {
    try{
      const res = await http.get(`/admin/demo/menu-book/default/code/${code}`);
      if(res.data.success){
        setText(JSON.stringify(res.data.data, null, 2));
      }
    }
    catch(err){
      setMessage(httpMessage(err));
    }
  }

  // Make sure lazy import updates when `selected` changes
  const Template = useMemo(() => {
    if (!selected) return null;
    return lazy(() => import(`../templates/menuBooks/${selected}.jsx`));
  }, [selected]);

  // Parse JSON5 safely + show validation
  const { parsedData, error } = useMemo(() => {
    try {
      const data = JSON5.parse(text);
      return { parsedData: data, error: "" };
    } catch (e) {
      return { parsedData: null, error: e?.message || "Invalid JSON5" };
    }
  }, [text]);
  

  // Optional: clear flash after a bit
  useEffect(() => {
    if (!message.visible) return;
    const t = setTimeout(() => setMessage(defaultMessage), 3000);
    return () => clearTimeout(t);
  }, [message.visible]);

  const showMsg = (type, msg) => setMessage({ visible: true, type, msg });

  // Adjust endpoints/payload to your backend
  const handleCreateTemplate = async () => {
    if (!parsedData || error) return;

    try {
      // Example endpoint — change to yours
      const res = await http.post("/admin/demo/menu-book/create", parsedData);

      showMsg("success", httpMessage?.success?.(res) ?? "Created successfully");
    } catch (err) {
      showMsg("error", httpMessage?.error?.(err) ?? "Create failed");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!parsedData || error) return;

    try {
      // Example endpoint — change to yours
      const res = await http.put(`/admin/demo/menu-book`, parsedData);

      showMsg("success", httpMessage?.success?.(res) ?? "Updated successfully");
    } catch (err) {
      showMsg("error", httpMessage?.error?.(err) ?? "Update failed");
    }
  };

  return (
    <div className={styles.page}>
      {/* LEFT PANEL */}
      <aside className={styles.left}>
        {/* SELECTION TEMPLATES */}
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {jsxFileList.map((file) => (
            <option key={file} value={file}>
              {file}.jsx
            </option>
          ))}
        </select>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: "inline-flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showDefault}
              onChange={(e) => setShowDefault(e.target.checked)}
            />
            <span style={{ marginLeft: 6 }}>Show Default</span>
          </label>
        </div>

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

        {/* Only show buttons when parse succeeded */}
        {!error && parsedData && (
          <div className={styles.buttonGroup}>
            <button className={styles.primary} onClick={handleCreateTemplate}>
              Create Template
            </button>
            <button className={styles.secondary} onClick={handleUpdateTemplate}>
              Update Template
            </button>
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

      <FlashMessage
        show={message.visible}
        type={message.type}
        message={message.msg}
      />
    </div>
  );
}
