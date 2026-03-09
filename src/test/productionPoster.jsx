import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/renderProductionMenu.module.css";
import http from "../http/http";
import LoadingModal from "../components/loading";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import ModelShowcase from "../components/modelShowcase";


const modules = import.meta.glob("../templates/**/*.jsx");

export default function RenderProductionPoster() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);


  useEffect(() => {
    let alive = true;

    const fetchTemplate = async () => {
      setLoading(true);
      setFetchFailed(false);

      try {
        const res = await http.get(`/poster/${type}/code/${code}/template/${id}/public/${publicCode}`);
        if (!alive) return;
        if (res.data?.success && res.data?.data) {
          setTemplate(res.data.data);
        } else {
          setTemplate(null);
          setFetchFailed(true);
        }
      } catch (err) {
        if (!alive) return;
        setTemplate(null);
        setFetchFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchTemplate();
  }, [type, id, code, publicCode]);




  const key = template?.code ? `../templates/posters/${template.code}.jsx` : null;

  const Template = useMemo(() => {
    if (!key) return null;
    const loader = modules[key];
    return loader ? lazy(loader) : null;
  }, [key]);

  if (loading) {
    return <LoadingModal open={true} title="Template" subtitle="Loading..." />;
  }

  if (fetchFailed || !template || !Template) {
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  }

  const content = (
    <Suspense
      fallback={
        <LoadingModal open={true} title="Menu" subtitle="Loading template..." />
      }
    >
      <Template
        data={template}
        onSave={(tem) => console.log(tem)}
        onClickModel={(item) => {
          setSelectedModel(item);
          setModelOpen(true);
        }}
      />
    </Suspense>
  );

  const wrappedContent = isMobile ? content : <PdfPageWrapper>{content}</PdfPageWrapper>;

  return (
    <div>
      {wrappedContent}
    
      {/* Render modal ONCE */}
      <ModelShowcase
        open={modelOpen}
        item={selectedModel}
        onClose={() => setModelOpen(false)}
        extras={template?.extras || []}
      />

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
        <button className={styles.notFoundBtn} onClick={onGoback}>
          Go Back
        </button>
      </div>
    </div>
  );
}
