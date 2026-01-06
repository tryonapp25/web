import React, { useState, useContext } from "react";
import styles from "../styles/Login.module.css";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/flashMessage";

export default function Login() {
  const navigate  = useNavigate();
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [email, setEmail] = useState(publicUser?.email || "");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await http.post(`/login`,{
        email: email,
        password: password
      });
      if(res.data.success){
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.data));
        setPublicUser(res.data.data);
        navigate("/home")
      }
    }
    catch(err){
      alert(err)
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.loginBox}>
          <h2 className={styles.title}>Login</h2>
          <p className={styles.subtitle}>Welcome back 👋</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.button} type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
