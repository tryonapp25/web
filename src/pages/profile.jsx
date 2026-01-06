import { useContext, useState } from "react";
import { UserContext } from "../ApiContext/userContext";
import  Questionnaire from "../components/questionnaire";
import { PROFILE_QUESTIONS } from "../questions";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import http from "../http/http";
import styles from "../styles/profile.module.css";

export default function Profile(){
  const navigate = useNavigate();
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [profile, setProfile] = useState(publicUser?.userProfiles || null);

  const UpdateUserProfile = async (profile) => {
    try{
      const res = await http.put(`/user/${publicUser?.uid}/profiles`, profile)
      if(res.data.success){
        setPublicUser(res.data.data);
        setProfile(res.data.data.userProfiles); 
        alert("save userProfile successfully");
      }
    }
    catch(err){
      alert(err)
    }
  }

  if(!profile) return <Questionnaire QUESTIONS={PROFILE_QUESTIONS} onSubmit={(d) => UpdateUserProfile(d)}/>

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile Summary</h1>
          <button className={styles.editBtn} onClick={() => setProfile(null)}>Edit</button>
        </div>


        <div className={styles.card}>
          <Row label="Gender style" value={profile.genderStyle} />
          <Row label="Age" value={profile.age} />
          <Row label="Height (cm)" value={profile.height} />
          <Row label="Weight (kg)" value={profile.weight} />
          <Row label="Style confidence" value={profile.styleConfidence} />
          <Row label="Color contrast" value={profile.colorContrast} />
          <Row label="Currency" value={profile.currency} />

          <Row label="Style interests" value={profile.styleInterests} />
          <Row label="Liked colors" value={profile.likedColors} />
          <Row label="Disliked colors" value={profile.dislikedColors} />
          <Row label="Preferred brands" value={profile.preferredBrands} />
          <Row label="Avoid brands" value={profile.avoidBrands} />
        </div>
      </div>
    );
  }

  function Row({ label, value }) {
    return (
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {Array.isArray(value)
            ? value.map((v) => <span key={v}>{v}</span>)
            : value}
        </span>
      </div>
    );
  }
