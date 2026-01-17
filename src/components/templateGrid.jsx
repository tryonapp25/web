import React, { Suspense, lazy, useMemo, useState } from "react";
import styles from "../styles/TemplateGrid.module.css";
import ConfirmDialog from "./confirmDialog";
import { useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";

const modules = import.meta.glob("../templates/*.jsx"); //"../templates/*/*.jsx"

export default function TemplateGrid({ templates = [], onUpdateTemplates }) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelectTemplate = (tem) => {
    setSelectedTemplate(tem);
    setOpenModal(true);
  };

  // Build a stable lookup: filePath -> LazyComponent
  const lazyByPath = useMemo(() => {
    const map = {};
    for (const path of Object.keys(modules)) {
      map[path] = lazy(modules[path]);
    }
    return map;
  }, []);

  const handleBuy = async () => {
    setOpenModal(false);
    //navigate("/payment");
    try{
      const res = await http.post(`/buy-templates`, selectedTemplate);
      if(res.data.success){
        alert("success");
      }
    }
    catch(err){
      alert(httpMessage(err))
    }
  };

  const handlePreview = () => {
    setOpenModal(false);
    if (!selectedTemplate?.code || !selectedTemplate?.id) return;
    navigate(`/code/${selectedTemplate.code}/template/${selectedTemplate.id}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {templates.map((item, index) => {
          const path = `../templates/${item?.code}.jsx`;
          const Template = lazyByPath[path];

          if (!Template) return null;

          return (
            <div key={item?.id ?? index} className={styles.card}>
              <div className={styles.scaleWrap}>
                <Suspense fallback={<div>Loading...</div>}>
                  <Template
                    data={item}
                    pressable
                    onPress={handleSelectTemplate}
                  />
                </Suspense>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={openModal}
        title="Do you want to buy this template or preview it?"
        confirmText="Buy"
        cancelText="Preview"
        onConfirm={handleBuy}
        onCancel={handlePreview}
      />
    </div>
  );
}
