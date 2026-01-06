import React, { useState, useContext } from "react";
import styles from "../styles/Signup.module.css";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const { setPublicUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      alert("Passwords do not match");
      return;
    }
    if (!agree) {
      alert("Please agree to Terms & Privacy Policy");
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
        <h2 className={styles.title}>Create account</h2>
        <p className={styles.subtitle}>Join us in a few seconds ✨</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
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
              I agree to the{" "}
              <a href="https://pro.api.tryon.stamply.nu/web/privacy-policy">Terms</a> &{" "}
              <a href="https://pro.api.tryon.stamply.nu/web/privacy-policy">Privacy Policy</a>
            </span>
          </label>

          <button className={styles.button} type="submit" disabled={!agree}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
