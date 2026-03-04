import React, { useState, useContext } from "react";
import styles from "../styles/Signup.module.css";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const navigate = useNavigate();
  const { setPublicUser } = useContext(UserContext);
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      alert(t('auth.passwordMismatch'));
      return;
    }
    if (!agree) {
      alert(t('auth.agreeRequired'));
      return;
    }

    try {
      const res = await http.post("/sigup", {
        email,
        userName,
        password,
      });

      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token);
        navigate("/login");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>{t('auth.createAccount')}</h2>
        <p className={styles.subtitle}>{t('auth.joinUs')}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder={t('auth.email')}
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder={t('auth.username')}
            className={styles.input}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="password"
            placeholder={t('auth.password')}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder={t('auth.confirmPassword')}
            className={styles.input}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              {t('auth.agreeTerms')}{" "}
              <a href="https://pro.api.tryon.stamply.nu/web/privacy-policy">{t('auth.terms')}</a> &{" "}
              <a href="https://pro.api.tryon.stamply.nu/web/privacy-policy">{t('auth.privacyPolicy')}</a>
            </span>
          </label>

          <button className={styles.button} type="submit" disabled={!agree}>
            {t('auth.signup')}
          </button>
        </form>
      </div>
    </div>
  );
}
