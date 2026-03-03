import { Outlet, useLocation } from "react-router-dom";
import { UserProvider } from "./userContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { getFeatureFlags } from "../featureFlags/featureFlags";

import http from "../http/http";
const publicCode = new URLSearchParams(window.location.search).get("public");



export default function ProductionProtection() {
  const location = useLocation(); // ⭐ IMPORTANT
  const startupRef = useRef(false);
  const { setOrderFeatureEnabled } = useContext(SocketContext);

  useEffect(() => {
    if (startupRef.current) return;
    startupRef.current = true;

    orderFeatureEnabledChecker();
  }, [location.pathname]);

  const orderFeatureEnabledChecker = async () => {
      try {
          const response = await http.get(`/business/feature/ORDER_ONLINE/publicCode/${publicCode}`);
          const flag = await checkFeatureFlag();
          if(response?.data?.data && flag){
            setOrderFeatureEnabled(true);
          } 
      } catch (error) {        console.error("Error fetching business order online feature status:", error);
          return false; // Default to false if there's an error
      }
  }

  const checkFeatureFlag = async () => {
    const isEnabled = await getFeatureFlags("ORDER_FEATURE")
    return isEnabled;
  }

  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}