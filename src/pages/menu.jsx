import { useRef, useState, useEffect, useContext } from "react";
import styles from "../styles/menupage.module.css";
import Sidebar from "../homeComponents/sideBar";
import Topbar from "../homeComponents/topbar";
import http from "../http/http";
import httpMessage  from "../http/httpMessage";
import TemplateGrid from "../components/templateGrid";
import LoadingModal from "../components/loading";
import QuickAction from "../components/quickAction";
import UploadFileCard from "../components/uploadFile";
import { UserContext } from "../ApiContext/userContext";
import MenuBookGrid from "../components/menuBookGrid";
import { getFeatureFlags } from "../featureFlags/featureFlags";
import PagesRows from "../components/pagesRows";


function HeroTitle() {
  return (
    <div className={styles.heroHead}>
      <h1 className={styles.pageTitle}>
        3D Menu templates.
      </h1>
    </div>
  );
}

export default function MenuPage() {
  const generatorRef = useRef(null);
  const {publicUser} = useContext(UserContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("templates");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [quickAction, setQuickAction] = useState([
    {tabName: "templates", name: "Explore"},
  ])


  useEffect(() => {
    switch(tab){
      case "menu_book":
        handleGetMenuBooks();
        break;
      default:
        handleGetTemplates(currentPage + 1);
        break;
    }
    checkFeatureFlags()
  },[tab]);


  const checkFeatureFlags = async () => {
    const hasMenuBook = await getFeatureFlags("MENU_BOOK");
    if (!hasMenuBook) return;

    setQuickAction(prev => {
      const exists = prev.some(action => action.tabName === "menu_book");
      if (exists) return prev;

      console.log('Adding menu_book quick action');
      return [...prev, { tabName: "menu_book", name: "MenuBooks" }];
    });
  };
  
  const handleGetMenuBooks = async () => {
    if(loading) return;
    try{
      setLoading(true);
      setTemplates([]);
      const res = await http.get(`/demo/menu-book/templates`);
      if(res.data.success){
        setTemplates(res.data.data);
      }
    }
    catch(err){
      console.log(httpMessage(err));
    }
    finally{
      setLoading(false);
    }
  }

  const handleGetTemplates = async (page) => {
    try{
      setLoading(true)
      const res = await http.get(`/demo/templates?page=${page}`);
      if(res.data.success){
        setTemplates(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
        setCurrentPage(res.data.page);
      }
    }
    catch(err){
      console.log(httpMessage(err));
    }
    finally{
      setLoading(false);
    }
  }


  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleNextPage = () => {
    if(currentPage < totalPages){
      handleGetTemplates(currentPage + 1);
    }
  }

  const handlePrevPage = () => {
    if(currentPage > 0){
      handleGetTemplates(currentPage - 1);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <Sidebar/>

        <main className={styles.main}>
          <div ref={generatorRef}>
            <Topbar onGenerateClick={scrollToGenerator} />
          </div>
          <div ref={generatorRef}>
              <HeroTitle />
          </div>
          {/* <UploadFileCard/> */}
          <div style={{marginLeft:"28px"}}>
            <QuickAction onPress={(t) => setTab(t)} data={quickAction} activeTab={tab}/>
          </div>
          <div className={[styles.content, {backgroundColor:"transparent"}]}>
            {tab === "menu_book" || tab === "mine_menu_book" ? (
              <MenuBookGrid templates={templates} />
            ) : (
              <TemplateGrid templates={templates} />
            )}
          </div>
            <div style={{marginTop:"18px", marginBottom:"18px"}}>
              <PagesRows
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={60}
                totalItems={totalItems}
                onPrev={() => handlePrevPage()}
                onNext={() => handleNextPage()}
              />
            </div>
        </main>
       
      </div>

      <LoadingModal open={loading} title="Loading templates..."/>
    </div>
  );
}
