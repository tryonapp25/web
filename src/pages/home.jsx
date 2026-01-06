import Sidebar from "../components/sidebar";
import TopBanner from "../components/topBanner";
import QuickActions from "../components/quickActions";
import ExploreTabs from "../components/exploreTabs";
import FeedGrid from "../components/feedGrid";
import styles from "../styles/Home.module.css";
import { useState, useContext } from "react";
import { UserContext } from "../ApiContext/userContext";
import { PROFILE_QUESTIONS } from "../questions";
import Questionnaire from "../components/questionnaire";
import http from "../http/http";
import Header from "../components/header";
import ChoosePoses from "../components/choosePoses"
import StyleLoading from "../components/styleLoading";

export default function Home() {
  const [feedItems, setFeedItems] = useState({});
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(publicUser?.userProfiles || null);
  const [openChoosePose, setOpenChoosePose] = useState(false);
  const [defaultPoses, setDefaultPoses] = useState([]);
  const [loading, setLoading] = useState(false);


  const CreateUserProfile = async (profile) => {
    try{
      const res = await http.post(`/user/${publicUser?.uid}/profiles`, profile)
      if(res.data.success){
        setPublicUser(res.data.data);
        setUserProfile(res.data.data.userProfiles); 
        alert("save userProfile successfully");
      }
    }
    catch(err){
      alert(err)
    }
  }

  const handleDeleteion = async (data) => {
    switch(true){
      case data.id === "history":
        await handleDeleteGenerationsImageHistory(data?.data);
        return
      case data.id === "poses":
        await handleDeleteUserPoses(data?.data);
        return;
    }
  }

  const handleDeleteUserPoses = async (item) => {
    try {
      const id = item?.id;
      const url = item?.img;
      const res = await http.delete(
        `/user/${id}/poses/${id}/url/${encodeURIComponent(url)}`
      );

      if (res.data?.success) {
        setPublicUser(res.data.data);
       setFeedItems((prev) => ({
        ...prev,
        data: (prev?.data || []).filter((x) => x.id !== id),
      }));
      }
    } catch (err) {
      alert("Failed to delete user poses");
    }
  };

  const handleDeleteGenerationsImageHistory = async (item) => {
    try {
      const id = item?.id;
      const url = item?.img;

      const res = await http.delete(
        `/user/${id}/imageGenerations/${id}/url/${encodeURIComponent(url)}`
      );

      if (res.data?.success) {
       setFeedItems((prev) => ({
        ...prev,
        data: (prev?.data || []).filter((x) => x.id !== id),
      }));
      }
    } catch (err) {
      alert("Failed to delete image generations");
    }
  };

  const handleGetDefaultPoses = async (data) => {
    if(data?.id !== "poses") return;
    if(publicUser?.poses.length === 4) return;
    try{
      const res = await http.get(`/default-poses`);
      if(res.data.success){
        setDefaultPoses(res.data.data);
        setOpenChoosePose(true);
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const handleGeneratePose = async (data) => {
    const pose = data?.selectedPose;
    for(const item of publicUser?.poses){
      if(item?.name === pose?.name) return alert("You already has the pose");
    }
    const arr = [];
    arr.push(data?.selectedPose)
    try{
      setOpenChoosePose(true);
      setLoading(true);

      const res = await http.post(`/add-poses/nano-banana`, {
        user: publicUser,
        poses: arr,
        tokens: data?.tokenUsage
      });
      if(res.data.success){
        setPublicUser(res.data.data);
        setFeedItems({id: "poses", data: res.data.data.poses})
      }
    }
    catch(err){
      alert(err)
    }
    finally{
      setLoading(false);
    }
  }

  if(!userProfile) return <Questionnaire QUESTIONS={PROFILE_QUESTIONS} onSubmit={(d) => CreateUserProfile(d)}/>
  
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <div style={{marginBottom:12}}>
          <Header userName="Minh" token={8}/>
        </div>
        <TopBanner />
        <QuickActions />
        <ExploreTabs onSubmit={(d) => setFeedItems(d)} />
        <FeedGrid data={feedItems} onDelete={(d) => handleDeleteion(d)} addMore={(d) => handleGetDefaultPoses(d)}/>
      </main>

      <StyleLoading label="Generating new pose" visible={loading}/>
      <ChoosePoses isOpen={openChoosePose} poses={defaultPoses} onClose={()=> setOpenChoosePose(false)} generate={(d) => handleGeneratePose(d)}/>
    </div>
  );
}
