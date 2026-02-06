import React, { useState, useContext } from "react";
import styles from "../styles/Login.module.css";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/flashMessage";
import httpMessage from "../http/httpMessage";
import ActivityIndicator from "../components/activityIndicator";
import { Link } from "react-router-dom";

const defaultMessage = { visible: false, type: "", msg: ""};

export default function Login() {
  const navigate  = useNavigate();
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [email, setEmail] = useState(publicUser?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await http.post(`/login`,{
        email: email,
        password: password
      });
      if(res.data.success){
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.data));
        setPublicUser(res.data.data);
        navigate("/menu")
      }
    }
    catch (err) {
      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(err) || "Login failed",
      });
    }
    finally{
      setLoading(false);
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

            <Link to="/">
              <p className={styles.noAccount}>
                Don’t have an account?
              </p>
            </Link>

            <button className={styles.button} disabled={loading}>
              {loading ? <ActivityIndicator /> : "Sign In"}
            </button>

          </form>
        </div>
      </div>

      <FlashMessage show={message.visible} message={message?.msg} type={message.type} onClose={() => setMessage(defaultMessage)}/>
    </div>
  );
}
