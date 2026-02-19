import React, { useMemo, useState, lazy, Suspense, useEffect } from "react";
import JSON5 from "json5";
import styles from "../styles/CreateTemplate.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";
import PdfPageWrapper from "../components/pdfPageWrapper";

const files = import.meta.glob("../templates/posters/POST*.jsx");

// filenames without extension
const jsxFileList = Object.keys(files).map((path) =>
  path.split("/").pop().replace(/\.jsx$/, "")
);

function removeJsxExtension(filename) {
  return filename.replace(/\.jsx$/, "");
}

const defaultText = `{
  "id": 5,
  "uid": 5,
  "isPublic": false,
  "publicCode": {
    "String": "",
    "Valid": false
  },
  "price": 1,
  "code": "POST01",
  "type": "demo",
  "category": "poster",
  "subheading": "THE FOOD RESTO",
  "heading": "MENU",
  "contents": [
    {
      "title": "",
      "description": "",
      "data": [],
      "model": "",
      "images": null,
      "ingredients": null
    }
  ],
  "information": {
    "address": "555 YOUR CITY, AMAZING STATE 28888",
    "phone": "123-555-2414",
    "website": "WWW.YOURWEBSITE.COM",
    "more": {
      "hours": "OPEN 2 PM - 11 PM",
      "badgeSmall": "SPECIAL MENU",
      "badgeLarge": "ENJOY 20% OFF",
      "bgColor": "#111111",
      "accentColor": "#f5a623",
      "textColor": "#ffffff",
      "mutedColor": "#bbbbbb",
      "badgeRotation": -5,
      "plateSize": 280
    }
  }
}`;

const defaultMessage = { visible: false, type: "", msg: "" };

export default function EditPosterTemplate() {
  const [text, setText] = useState(defaultText);
  const [message, setMessage] = useState(defaultMessage);
  const [selected, setSelected] = useState(jsxFileList[0] || "POST01");

  useEffect(() => {
    getTemplateDataByCode(removeJsxExtension(selected));
  }, [selected]);

  const getTemplateDataByCode = async (code) => {
    try {
      const res = await http.get(`/admin/demo/poster/templates/code/${code}`);
      if (res.data.success) {
        setText(JSON.stringify(res.data.data, null, 2));
      }
    } catch (err) {
      setMessage(httpMessage(err));
    }
  };

  // Make sure lazy import updates when `selected` changes
  const Template = useMemo(() => {
    if (!selected) return null;
    return lazy(() => import(`../templates/posters/${selected}.jsx`));
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

  const handleCreateTemplate = async () => {
    if (!parsedData || error) return;

    try {
      const res = await http.post("/admin/demo/poster/templates/create", parsedData);
      showMsg("success", httpMessage?.success?.(res) ?? "Created successfully");
    } catch (err) {
      showMsg("error", httpMessage?.error?.(err) ?? "Create failed");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!parsedData || error) return;

    try {
      const res = await http.put(`/admin/demo/poster/templates`, parsedData);
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

        <h2 className={styles.title}>Edit Poster Template (JSON / JS Object)</h2>

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
