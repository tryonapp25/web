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


const quickAction = [
  {tabName: "mine", name: "My templates"},
  {tabName: "mine_menu_book", name: "My Menu Books"}
]

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
  const [tab, setTab] = useState("mine_menu_book")


  useEffect(() => {
    switch(tab){
      case "mine_menu_book":
        handleGetUserMenuBooks();
        break;
      default:
        handleGetUserProductionTemaplate(publicUser?.uid);
        break;
    }
  },[tab]);

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
            {tab === "menu_book" || tab === "mine_menu_book" ? (
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
