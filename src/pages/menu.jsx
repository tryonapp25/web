import { useRef, useState, useEffect, useContext } from "react";
import styles from "../styles/home.module.css";
import Sidebar from "../homeComponents/sideBar";
import Topbar from "../homeComponents/topbar";
import http from "../http/http";
import httpMessage  from "../http/httpMessage";
import TemplateGrid from "../components/templateGrid";
import LoadingModal from "../components/loading";
import QuickAction from "../components/quickAction";
import UploadFileCard from "../components/uploadFile";
import { UserContext } from "../ApiContext/userContext";


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
  const [tab, setTab] = useState("templates")


  useEffect(() => {
    if(tab === "templates"){
      handleGetTemplates();
    }
    else{
      handleGetUserTemaplate(publicUser?.uid);
    }
  },[tab]);
  
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

  const handleGetUserTemaplate = async (uid) => {
    try{
      setLoading(true);
      setTemplates([]);
      const res = await http.get(`/user/${uid}/templates`);
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
          <UploadFileCard/>
          <div style={{marginLeft:"28px"}}>
            <QuickAction onPress={(t) => setTab(t)}/>
          </div>
          <div className={[styles.content, {backgroundColor:"transparent"}]}>
            <TemplateGrid templates={templates}/>
          </div>
        </main>
      </div>

      <LoadingModal open={loading} title="Loading templates..."/>
    </div>
  );
}
