import { useRef, useState, useEffect, useContext } from "react";
import styles from "../styles/menupage.module.css";
import Sidebar from "../homeComponents/sideBar";
import Topbar from "../homeComponents/topbar";
import http from "../http/http";
import httpMessage  from "../http/httpMessage";
import TemplateGrid from "../components/templateGrid";
import LoadingModal from "../components/loading";
import QuickAction from "../components/quickAction";
import { UserContext } from "../ApiContext/userContext";
import MenuBookGrid from "../components/menuBookGrid";
import { getFeatureFlags } from "../featureFlags/featureFlags";




function HeroTitle() {
  return (
    <div className={styles.heroHead}>
      <h1 className={styles.pageTitle}>
        My Collections.
      </h1>
    </div>
  );
}

export default function MyCollection() {
  const generatorRef = useRef(null);
  const {publicUser} = useContext(UserContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("mine");

  const [quickAction, setQuickAction] = useState([
    {tabName: "mine", name: "My templates", isActive: true},
  ])


  useEffect(() => {
    switch(tab){
      case "mine_menu_book":
        handleGetUserMenuBooks();
        break;
      default:
        handleGetUserProductionTemaplate(publicUser?.uid);
        break;
    }
    checkFeatureFlags();
  },[tab]);

  const checkFeatureFlags = async () => {
    const hasMenuBook = await getFeatureFlags("MENU_BOOK");
    if (!hasMenuBook) return;

    setQuickAction(prev => {
      const exists = prev.some(action => action.tabName === "mine_menu_book");
      if (exists) return prev;

      console.log('Adding menu_book quick action');
      return [...prev, { tabName: "mine_menu_book", name: "MenuBooks" }];
    });
  };

  const handleGetUserMenuBooks = async () => {
    if(loading) return;
    try{
      setLoading(true);
      setTemplates([]);
      const res = await http.get(`/production/menu-book/templates`);
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


  const handleGetUserProductionTemaplate = async (uid) => {
    try{
      setLoading(true);
      setTemplates([]);
      const res = await http.get(`/user/${uid}/production/templates`);
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

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
          <div style={{marginLeft:"28px"}}>
            <QuickAction onPress={(t) => setTab(t)} data={quickAction}/>
          </div>
          <div className={[styles.content, {backgroundColor:"transparent"}]}>
            {tab === "mine_menu_book" ? (
              <MenuBookGrid templates={templates} />
            ) : (
              <TemplateGrid templates={templates} />
            )}
          </div>
        </main>
      </div>

      <LoadingModal open={loading} title="Loading templates..."/>
    </div>
  );
}
