import { useState, useContext, useEffect } from "react";
import styles from "../styles/Profile.module.css";
import { UserContext } from "../ApiContext/userContext";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";
import FilterGrid from "../components/filterGrid";
import LoadingModal from "../components/loading";
import Topbar from "../components_home/topbar";
import { useTranslation } from "react-i18next";



export default function Profile() {
    const { publicUser, setPublicUser } = useContext(UserContext);
    const { t } = useTranslation();
    const [username, setUsername] = useState(publicUser?.userName);
    const [email, setEmail] = useState(publicUser?.email);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState([]);
    const [message, setMessage] = useState({ visible:false, msg:"", type:"" });

    /* const fetchMyFilters = async (uid) => {
      try {
          setLoading(true);
          const res = await http.get(`/user/${uid}/public-filters`);
          if (res.data?.success) setFilters(res.data.data || []);
      } catch (err) {
          setMessage({ visible: true, msg: httpMessage(err), type: "error" });
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
    fetchMyFilters(publicUser?.uid);
    }, []); */

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!onSave) return;

        try {
        setLoading(true);
        await onSave({ username, email });
        } finally {
        setLoading(false);
        }
    };

    const validate = () => {
      if (!(username ?? "").trim()) {
        Alert.alert(t('profile.missingName'), t('profile.enterName'));
        return false;
      }
  
      const e = (email ?? "").trim();
      if (!e) {
        Alert.alert(t('profile.missingEmail'), t('profile.enterEmail'));
        return false;
      }
  
      if (!/^\S+@\S+\.\S+$/.test(e)) {
        Alert.alert(t('profile.invalidEmail'), t('profile.enterValidEmail'));
        return false;
      }
  
      setMessage({ visible:false, msg:"", type:"" })
      return true;
    };

  const onSave = async () => {
    if (!validate()) return;
    try {
      publicUser.userName = username;
      publicUser.email = email;

      const res = await http.put(`/user`, publicUser);
      if (res.data.success) {
        setPublicUser(res.data.data);
        setUsername(res.data.data.userName);
        setEmail(res.data.data.email);
        setMessage({visible:true, type:"success", msg: res.data.message || "Update profile successfully."})
        return;
      }
    } catch (err) {
      setMessage({visible:true, type:"success", msg: httpMessage(err)})
    } finally {
      setSaving(false);
    }
  };

return (
  <section className={styles.page}>
    <div className={styles.container}>
      {/* PROFILE CARD */}
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.cardTop}>
          <div>
            <h1 className={styles.title}>{t('profile.title')}</h1>
            <p className={styles.sub}>Update your public details.</p>
          </div>

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('common.save')}
          </button>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              {t('profile.username')}
            </label>
            <input
              id="username"
              className={styles.input}
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              {t('profile.email')}
            </label>
            <input
              id="email"
              className={styles.input}
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>
        </div>

        {/* optional helper row */}
        <div className={styles.hintRow}>
          <span className={styles.hint}>
            Changes affect what’s shown publicly.
          </span>
        </div>
      </form>

      <div className={styles.sectionDivider} />
    </div>
    {/* <div className={styles.filtersSection}>
        <div className={styles.filtersHead}>
          <h2 className={styles.h2}>Your Public Filters</h2>
          <p className={styles.sub2}>Manage and preview what you’ve shared.</p>
        </div>

        <FilterGrid data={filters} />
    </div> */}

    <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage({ visible:false, msg:"", type:"" })}/>
    <LoadingModal open={loading}/>
  </section>
);


}
