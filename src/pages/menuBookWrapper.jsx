import { useMemo, useState, Suspense, lazy, useEffect } from "react";
import PdfPageWrapper from "../components/pdfPageWrapper";
import NoFoundTemplate from "../components/noFoundTemplate";
import useIsMobile from "../utils/deviceCheck";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import FlashMessage from "../components/flashMessage";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import LoadingModal from "../components/loading";
import defaultMessage from "../utils/defaultMessage";
import EditButton from "../components/editButton";
import MenuBookEditor from "../templates/menuBooks/MenuBookEditor";
import ModelShowcase from "../components/modelShowcase";

import { UpdateMenuBook } from "../utils/updateTemplate";

// load templates from templates folder (including subfolders) and menuBook wrappers
const templateModules = import.meta.glob("../templates/**/*.jsx");
const menuBookModules = import.meta.glob("../templates/menuBooks/*.jsx");

export default function MenuBookWraper() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const templatecode = searchParams.get("template");
  const menubookCode = searchParams.get("code");

  const editable = type === "production" ? true : false;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);     
      try {
        const response = await http.get(`/${type}/menu-book/template/${templatecode}/menubook/${menubookCode}/id/${id}`);
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
  const menuBookCode = data?.menuBookCode;

  const templatePath = `../templates/${templateCode}.jsx`;
  const templatePathAlt = `../templates/menu/${templateCode}.jsx`;
  const menuBookPath = `../templates/menuBooks/${menuBookCode}.jsx`;

  const LazyTemplate = templateMap[templatePath] || templateMap[templatePathAlt] || null;
  const LazyMenuBook = menuBookMap[menuBookPath] || null;

  const handleUpdateMenuBook = async (d) => {
    if (data?.type === "demo") return setIsEditMode(false);
    try {
      setLoading(true);
      const ok = await UpdateMenuBook(d);
      if (ok) {
        setData(d);
        setMessage({ visible: true, type: "success", msg: "Saved menu book successfully." });
        return;
      }
      setMessage({ visible: true, type: "error", msg: "Error saving menu book." });
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: "Error saving menu book." });
    } finally {
      setLoading(false);
      setIsEditMode(false);
    }
  }

  if (isEditMode && !isMobile) {
    return (
      <PdfPageWrapper>
        <MenuBookEditor
          data={data}
          onChange={(d) => handleUpdateMenuBook(d)}
        />
      </PdfPageWrapper>
    );
  } else if(isEditMode && isMobile) {
    return (
      <MenuBookEditor
        data={data}
        onChange={(d) => handleUpdateMenuBook(d)}
      />
    );
  }


  const Preview = (
    <div>
      <Suspense fallback={<div style={{ padding: 12 }}>Loading…</div>}>
        {editable && <EditButton onClick={() => setIsEditMode(true)}/>}
        {LazyMenuBook && LazyTemplate ? (
          <LazyMenuBook data={data}>
            <LazyTemplate onClickModel={(item) => {setSelectedModel(item); setModelOpen(true)}} />
          </LazyMenuBook>
        ) : (
          <NoFoundTemplate  onGoback={() => navigate("menu")}/>
        )}
      </Suspense>

      <ModelShowcase open={modelOpen} item={selectedModel} onClose={() => setModelOpen(false)}/>
        
      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage(defaultMessage)}/>
      <LoadingModal open={loading} message="Loading Menu Book..." />;
    </div>
  );

  return isMobile && !isEditMode ? Preview : <PdfPageWrapper>{Preview}</PdfPageWrapper>;
}


