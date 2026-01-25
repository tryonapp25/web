import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  useContext,
  lazy,
  Suspense,
} from "react";
import styles from "../styles/TemplateWraper.module.css";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";
import LoadingModal from "../components/loading";
import { UserContext } from "../ApiContext/userContext";
import useIsMobile from "../utils/deviceCheck";
import PdfPageWrapper from "../components/pdfPageWrapper";


const modules = import.meta.glob("../templates/*.jsx");
const defaultMessage = { visible: false, type: "", msg: "" };


export default function TemplateWraper() {
  const viewerRef = useRef(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { publicUser } = useContext(UserContext);

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/${type}/code/${code}/template/${id}`);
        if (res.data.success) setTemplate(res.data.data);
      } catch (err) {
        console.log(httpMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, type, code]);

  const key = template ? `../templates/${template?.code}.jsx` : null;

  const Template = useMemo(() => {
    if (!key) return null;
    const loader = modules[key];
    return loader ? lazy(loader) : null;
  }, [key]);

  if (!publicUser && !loading)
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  if (!template && !loading)
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  if (!Template)
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;

  // the save buton in the template //
  const handleClickSaveButton = (tem) => {
    if(tem?.type !== "production") return;
    handleUpdateProductionTemplate(tem);
  };

  const handleUpdateProductionTemplate = async (data) => {
    try{
      const res = await http.put(`/production/templates`, data);
      if(res.data.success){
        setMessage({visible:true, type:"success", msg: res.data.message || "update template successfully."})
      }
    }
    catch(err){
      setMessage({visible:true, type:"error", msg: httpMessage(err)})
    }
  }

  return (
    <div ref={viewerRef}>
      
      {isMobile ?
        <Suspense
          fallback={
            <LoadingModal
              open={true}
              title="Menu"
              subtitle="Loading template..."
            />
          }
        >
          <Template data={template} editable={true} onSave={(tem) => handleClickSaveButton(tem)}/>
        </Suspense> 
        : 
        <PdfPageWrapper>
          <Suspense fallback={<LoadingModal open={true} title="Menu" subtitle="Loading template..."/>}
          >
            <Template data={template} editable={true} onSave={(tem) => handleClickSaveButton(tem)}/>
          </Suspense> 
        </PdfPageWrapper>
      }

      <LoadingModal open={loading} title="Menu" subtitle="Loading template..." />
      <FlashMessage
        show={message.visible}
        type={message.type}
        message={message.msg}
        onClose={() => setMessage(defaultMessage)}
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

