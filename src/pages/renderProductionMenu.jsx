import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams  } from "react-router-dom";
import styles from "../styles/templatePage.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import LoadingModal from "../components/loading";
import { useNavigate } from "react-router-dom";


const modules = import.meta.glob("../templates/*.jsx");


export default function RenderProductionMenu() {
  const navigate = useNavigate()
  const {type, id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const publicCode = searchParams.get("public");


  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/${type}/code/${code}/template/${id}/public/${publicCode}`);
        if (res.data.success){
          setTemplate(res.data.data)
        };
        console.log(res.data)
      } catch (err) {
        alert(httpMessage(err))
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  // ✅ don’t build a key until we actually have template data
  const key = template ? `../templates/${template?.code}.jsx` : null;

  const Template = useMemo(() => {
    if (!key) return null;
    const loader = modules[key];
    return loader ? lazy(loader) : null;
  }, [key]);


  if (!template && !loading) return <NoFoundTemplate onGoback={() => navigate("/menu")}/>
  if (!Template) return <NoFoundTemplate onGoback={() => navigate("/menu")}/>

  
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#333"
      }}
    >
      <div className={styles.card}>
        <div className={styles.scaleWrap}>
          <Suspense fallback={<LoadingModal open={true} title="Menu" subtitle="Loading template..."/>}>
            <Template data={template} editable={true} onSave={(tem) => console.log(tem)}/>
          </Suspense>
        </div>
      </div>
      <LoadingModal open={loading} title="Menu" subtitle="Loading template..."/>
    </div>
  );
}


function NoFoundTemplate({onGoback}){
  return (
    <div className={styles.notFoundWrap}>
      <div className={styles.notFoundCard}>
        <div className={styles.notFoundIcon}>🍕</div>
        <h2 className={styles.notFoundTitle}>Template Not Found</h2>
        <p className={styles.notFoundText}>
          The menu template you’re looking for doesn’t exist or was removed.
        </p>

        <button
          className={styles.notFoundBtn}
          onClick={() => onGoback()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}