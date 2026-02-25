import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import { BusinessContext } from "../ApiContext/businessContext";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import Sidebar from "../components_business/businessSidebar";
import BusinessOrders from "./businessOrders";
import FlashMessage from "../components/flashMessage";
import styles from "../styles/OrderBoard.module.css";

export default function OrderBoard() {
  const navigate = useNavigate();
  const { publicUser } = useContext(UserContext);
  const { connected, connectBusiness } = useContext(SocketContext);
  const { businessInfo, setBusinessInfo } = useContext(BusinessContext);
  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const connectingRef = useRef(false);

  useEffect(() => {
    if (!publicUser) {
      navigate("/login");
      return;
    }

    const fetchBusinessInfo = async () => {
      if (businessInfo) return;
      try {
        const res = await http.get(`/business/user/uid/${publicUser.uid}`);
        if (res.data?.success) {
          setBusinessInfo(res.data.data);
          setMessage({ visible: true, type: "success", msg: "Business info loaded" });
        } else {
          setMessage({ visible: true, type: "error", msg: res.data?.message || "Failed to load business info" });
        }
      } catch (err) {
        setMessage({ visible: true, type: "error", msg: httpMessage(err) || "Failed to load business info" });
      }
    };

    fetchBusinessInfo();

    if (connected || connectingRef.current) return;

    connectingRef.current = true;
    connectBusiness(publicUser).catch((err) => {
      connectingRef.current = false;
      console.error("connectBusiness failed", err);
    });
  }, [publicUser, connected, businessInfo, navigate, connectBusiness, setBusinessInfo]);

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <BusinessOrders />
      </main>

      <FlashMessage
        visible={message.visible}
        type={message.type}
        msg={message.msg}
        onClose={() => setMessage({ visible: false, type: "", msg: "" })}
      />
    </div>
  );
}