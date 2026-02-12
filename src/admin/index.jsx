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
import {
  LayoutDashboard,
  FileEdit,
  Puzzle
} from "lucide-react";

const defaultItems = [
  { icon: LayoutDashboard, label: "Admin", path: "/admin" },
  { icon: FileEdit, label: "Edit Template", path: "/admin/edit/template" },
  { icon: FileEdit, label: "Edit Menu Book", path: "/admin/edit/menubook" },
  { icon: Puzzle, label: "Features", path: "/admin/features" },
];

const quickAction = [
  {tabName: "templates", name: "Explore"},
  {tabName: "menu_book", name: "MenuBooks"},
]

function HeroTitle() {
  return (
    <div className={styles.heroHead}>
      <h1 className={styles.pageTitle}>
        3D Menu templates.
      </h1>
    </div>
  );
}

export default function AdminPage() {
  const generatorRef = useRef(null);
  const {publicUser} = useContext(UserContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("templates")


  useEffect(() => {
    switch(tab){
      case "menu_book":
        handleGetMenuBooks();
        break;
      default:
        handleGetTemplates();
        break;
    }
  },[tab]);

  
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

  const handleGetTemplates = async () => {
    try{
      setLoading(true)
      const res = await http.get(`/demo/templates`);
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
        <Sidebar items={defaultItems}/>

        <main className={styles.main}>
          <div ref={generatorRef}>
            <Topbar onGenerateClick={scrollToGenerator} />
          </div>
          <div ref={generatorRef}>
              <HeroTitle />
          </div>
          <UploadFileCard/>
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
        </main>
      </div>

      <LoadingModal open={loading} title="Loading templates..."/>
    </div>
  );
}
