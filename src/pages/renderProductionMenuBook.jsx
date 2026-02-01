import { useMemo, useState, Suspense, lazy, useEffect } from "react";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import NoFoundTemplate from "../components/noFoundTemplate";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import LoadingModal from "../components/loading";
import defaultMessage from "../utils/defaultMessage";

// load templates from templates folder (including subfolders) and menuBook wrappers
const templateModules = import.meta.glob("../templates/**/*.jsx");
const menuBookModules = import.meta.glob("../templates/menuBooks/*.jsx");

export default function RenderProductionMenuBook() {
  const isMobile = useIsMobile();
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const templatecode = searchParams.get("template");
  const menubookCode = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);     
      try {
        const response = await http.get(`/${type}/menu-book/template/${templatecode}/menubook/${menubookCode}/id/${id}/public/${publicCode}`);
        if(response?.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        const msg = httpMessage(error);
        setMessage(msg);
      } finally {
        setLoading(false);
      } 
    }
    fetchData();
  }, [type, id, templatecode, menubookCode]);

  const templateMap = useMemo(() => {
    const out = {};
    for (const p of Object.keys(templateModules)) out[p] = lazy(templateModules[p]);
    return out;
  }, []);

  const menuBookMap = useMemo(() => {
    const out = {};
    for (const p of Object.keys(menuBookModules)) out[p] = lazy(menuBookModules[p]);
    return out;
  }, []);

  // tolerantly read possible code fields (handles typos like `teplateCode`)
  const templateCode = data?.templateCode 
  const menuBookCode = data?.menuBookCode


  const templatePath = `../templates/${templateCode}.jsx`;
  const templatePathAlt = `../templates/menu/${templateCode}.jsx`;
  const menuBookPath = `../templates/menuBooks/${menuBookCode}.jsx`;



  const LazyTemplate = templateMap[templatePath] || templateMap[templatePathAlt] || null;
  const LazyMenuBook = menuBookMap[menuBookPath] || null;

  if (loading) {
    return <LoadingModal message="Loading Menu Book..." />;
  }

  const Preview = (
    <Suspense fallback={<div style={{ padding: 12 }}>Loading…</div>}>
      {LazyMenuBook && LazyTemplate ? (
        <LazyMenuBook data={data}>
          <LazyTemplate />
        </LazyMenuBook>
      ) : (
        <NoFoundTemplate onGoback={() => navigate("menu")} />
      )}
    </Suspense>
  );

  return isMobile ? Preview : <PdfPageWrapper>{Preview}</PdfPageWrapper>;
}
