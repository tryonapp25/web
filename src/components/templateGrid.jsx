import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import styles from "../styles/TemplateGrid.module.css";
import ConfirmDialog from "./confirmDialog";
import {useNavigate } from "react-router-dom";
import FlashMessage from "./flashMessage";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import QRCodeCard from "./QRCodeCard";

const defaultMessage = {visible: false, type: "", msg: ""};

const modules = import.meta.glob("../templates/*.jsx"); //"../templates/*/*.jsx"

export default function TemplateGrid({ templates = [] }) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [message, setMessage] = useState(defaultMessage);
  const [data, setData] = useState(templates || []);

  useEffect(()=> {
    setData(templates);
  },[templates])

  const handleSelectTemplate = (tem) => {
    if(tem?.type === "production") {
      navigate(`/${tem?.type}/template/${tem?.id}?code=${tem?.code}`);
      return;
    };
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
    navigate("/payment-template");
  };

  const handlePreview = () => {
    setOpenModal(false);
    if (!selectedTemplate?.code || !selectedTemplate?.id) return;
    navigate(`/${selectedTemplate?.type}/template/${selectedTemplate.id}?code=${selectedTemplate.code}`);
  };

  const handleSetTemplateStatus = async (tem, status) => {
    try{
      tem.isPublic = !status;
      const res = await http.put(`/template/status`, tem);
      if(res.data.success){
        setMessage({visible:true, type:"success", msg: tem.isPublic ? "Set public template." : "Set private template."});
        setData((prev) =>
          prev.map((item) =>
            item.id === tem.id
              ? { ...item, isPublic: !status }
              : item
          )
        );

      }
    }
    catch(err){
      setMessage({visible:true, type:"success", msg: httpMessage(err)})
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {data.map((item, index) => {
          const path = `../templates/${item?.code}.jsx`;
          const Template = lazyByPath[path];

          if (!Template) return null;

          return (
            <div key={item?.id ?? index} className={styles.card}>
              <div className={styles.scaleWrap}>
                <Suspense fallback={<div>Loading...</div>}>
                  {item?.type === "production" && (
                    <div
                      style={{
                        padding: "10px 45px",
                        borderTopRightRadius: "20px",
                        borderBottomLeftRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 600,
                        width: "fit-content",
                        backgroundColor: item?.isPublic ? "#E6F7F0" : "#FDECEC",
                        color: item?.isPublic ? "#0F766E" : "#B91C1C",
                        position: "absolute",
                        right: 0,
                        zIndex: 9999,
                      }}
                    >
                      <div
                        style={{
                          padding: "6px 14px",
                          backgroundColor: "#B91C1C",
                          color: "#fff",
                          borderRadius: "999px",
                          fontSize: "12px",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#991B1B")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#B91C1C")
                        }
                        onClick={() => handleSetTemplateStatus(item, item.isPublic)}
                      >
                        {item?.isPublic ? "Set to Private" : "Set to Public"}
                      </div>
                    </div>
                  )}
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

      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage(defaultMessage)}/>
    </div>
  );
}
