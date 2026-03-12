import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/renderProductionMenu.module.css";
import http from "../http/http";
import LoadingModal from "../components/loading";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import ModelShowcase from "../components/modelShowcase";
import clearTokens from "../utils/clearTokens";

const modules = import.meta.glob("../templates/**/*.jsx");

class TemplateErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Poster template crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.notFoundWrap}>
          <div className={styles.notFoundCard}>
            <div className={styles.notFoundIcon}>⚠️</div>
            <h2 className={styles.notFoundTitle}>Something went wrong</h2>
            <p className={styles.notFoundText}>
              The poster template failed to load correctly.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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

  const fetchTemplate = useCallback(async (mountedRef) => {
    setLoading(true);
    setFetchFailed(false);

    try {
      const res = await http.get(
        `/poster/${type}/code/${code}/template/${id}/public/${publicCode}`
      );

      if (!mountedRef.current) return;

      if (res?.data?.success && res?.data?.data) {
        setTemplate(res.data.data);
      } else {
        setTemplate(null);
        setFetchFailed(true);
      }
    } catch (err) {
      if (!mountedRef.current) return;

      console.error("fetch poster template error:", err);
      setTemplate(null);
      setFetchFailed(true);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [type, id, code, publicCode]);

  useEffect(() => {
    const mountedRef = { current: true };

    fetchTemplate(mountedRef);
    clearTokens();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchTemplate]);

  const key = template?.code
    ? `../templates/posters/${template.code}.jsx`
    : null;

  const hasTemplateModule = !!(key && modules[key]);

  const Template = useMemo(() => {
    if (!hasTemplateModule) return null;
    return lazy(modules[key]);
  }, [key, hasTemplateModule]);

  if (loading) {
    return <LoadingModal open={true} title="Template" subtitle="Loading..." />;
  }

  if (fetchFailed || !template || !Template) {
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  }

  const content = (
    <TemplateErrorBoundary>
      <Suspense
        fallback={
          <LoadingModal
            open={true}
            title="Poster"
            subtitle="Loading template..."
          />
        }
      >
        <Template
          data={template}
          onSave={(tem) => console.log("saved:", tem)}
          onClickModel={(item) => {
            setSelectedModel(item);
            setModelOpen(true);
          }}
        />
      </Suspense>
    </TemplateErrorBoundary>
  );

  const wrappedContent = isMobile ? (
    content
  ) : (
    <PdfPageWrapper>{content}</PdfPageWrapper>
  );

  return (
    <div>
      {wrappedContent}

      {modelOpen && (
        <ModelShowcase
          open={modelOpen}
          item={selectedModel}
          onClose={() => setModelOpen(false)}
          extras={template?.extras || []}
        />
      )}
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