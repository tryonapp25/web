// TemplateGrid.jsx
import React, { Suspense, lazy, useEffect, useMemo, useState , useContext} from "react";
import styles from "../styles/TemplateGrid.module.css";
import ConfirmDialog from "./confirmDialog";
import { useNavigate } from "react-router-dom";
import FlashMessage from "./flashMessage";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import { UserContext } from "../ApiContext/userContext";
import QrCodeModal from "./QrCodeModal";
import LoadingModal from "../components/loading";


const defaultMessage = { visible: false, type: "", msg: "" };
const modules = import.meta.glob("../templates/*.jsx");

export default function TemplateGrid({ templates = [] }) {
  const navigate = useNavigate();
  const {publicUser, setPublicUser} = useContext(UserContext);
  const [tokens, setTokens] = useState(publicUser?.token?.tokens);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [message, setMessage] = useState(defaultMessage);
  const [data, setData] = useState(templates || []);

  useEffect(() => setData(templates), [templates]);

  const handleSelectTemplate = (tem) => {
    setSelectedTemplate(tem);
    if (tem?.type === "production") {
      setOpenConfirmModal(true);
      return;
    }
    setOpenModal(true);
  };

  const handleClickEditTemplate = (tem) => {
    navigate(`/${tem?.type}/template/${tem?.id}?code=${tem?.code}`);
  };

  const lazyByPath = useMemo(() => {
    const map = {};
    for (const path of Object.keys(modules)) map[path] = lazy(modules[path]);
    return map;
  }, []);

  const handleBuy = async () => {
    setOpenModal(false);
    if(selectedTemplate?.price > tokens){
      setMessage({visible: true, type:"error", msg: "You don't have enough tokens"});
      return;
    }
    try{
      setLoading(true);
      const res = await http.post(`/production/create/template`, selectedTemplate);
      if(res.data.success){
        setMessage({visible: true, type: "success", msg: res.data.message});
        setPublicUser(res.data.data);
      }
    }
    catch(err){
      setMessage(httpMessage(err));
    }
    finally{
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setOpenModal(false);
    if (!selectedTemplate?.code || !selectedTemplate?.id) return;
    navigate(
      `/${selectedTemplate?.type}/template/${selectedTemplate.id}?code=${selectedTemplate.code}`
    );
  };

  const handleSetTemplateStatus = async (tem, status) => {
    try {
      setLoading(true);
      tem.isPublic = !status;
      const res = await http.put(`/template/status`, tem);
      if (res.data.success) {
        setMessage({
          visible: true,
          type: "success",
          msg: tem.isPublic ? "Set public template." : "Set private template.",
        });
        setData((prev) =>
          prev.map((item) =>
            item.id === tem.id ? { ...item, isPublic: !status } : item
          )
        );
      }
    } catch (err) {
      setMessage({ visible: true, type: "success", msg: httpMessage(err) });
    } finally {
      setLoading(false);
      setOpenConfirmModal(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {data.map((item, index) => {
          const path = `../templates/${item?.code}.jsx`;
          const Template = lazyByPath[path];
          if (!Template) return <NoFoundTemplate key={item?.id ?? index} />;

          return (
            <div key={item?.id ?? index} className={styles.card}>
              <div className={styles.badgeWrap}>
                {item?.type === "production" && <StatusBadge item={item} />}
              </div>
          
                <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
                  <Template data={item} pressable onPress={handleSelectTemplate} />
                </Suspense>
              
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
        onClose={() => setOpenModal(false)}
      />

      <QrCodeModal
        template={selectedTemplate}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onEdit={(tem) => handleClickEditTemplate(tem)}
        onPublish={(tem) => handleSetTemplateStatus(tem, tem?.isPublic)}
      />

      <FlashMessage
        show={message.visible}
        type={message.type}
        message={message.msg}
        onClose={() => setMessage(defaultMessage)}
      />

      <LoadingModal open={loading}/>
    </div>
  );
}

function NoFoundTemplate({ onGoback }) {
  return (
    <div className={styles.notFoundWrap}>
      <div className={styles.notFoundCard}>
        <div className={styles.notFoundIcon}>🍕</div>
        <h2 className={styles.notFoundTitle}>Template Not Found</h2>
        <p className={styles.notFoundText}>
          The menu template you’re looking for doesn’t exist or was removed.
        </p>
        <button className={styles.notFoundBtn} onClick={() => onGoback?.()}>
          Go Back
        </button>
      </div>
    </div>
  );
}

const StatusBadge = ({ item }) => {
  const isPublic = !!item?.isPublic;
  return (
    <div
      className={styles.badge}
      data-public={isPublic ? "true" : "false"}
      title={isPublic ? "Public" : "Private"}
    >
      {isPublic ? "Public" : "Private"}
    </div>
  );
};
