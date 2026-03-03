import { Outlet, useLocation } from "react-router-dom";
import { UserProvider } from "./userContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { BusinessContext } from "./businessContext";

import http from "../http/http";
const publicCode = new URLSearchParams(window.location.search).get("public");



export default function ProductionProtection() {
  const location = useLocation(); // ⭐ IMPORTANT
  const startupRef = useRef(false);
  const { setOrderFeatureEnabled } = useContext(SocketContext);
  const { setIsBusinessOpen } = useContext(BusinessContext);

  useEffect(() => {
    if (startupRef.current) return;
    startupRef.current = true;
    productionCheck();
  }, [location.pathname]);

  const productionCheck = async () => {
    try {
      const response = await http.get(`/production/checkout/business/publicCode/${publicCode}/flag/ORDER_FEATURE/businessFeature/ORDER_ONLINE`);
      if(response.data.success){
        const { orderFeatureEnabled, isBusinessOpen, flag } = response.data.data;
        if(flag && orderFeatureEnabled) setOrderFeatureEnabled(true);
        if(isBusinessOpen) setIsBusinessOpen(isBusinessOpen);
        return response.data.data;
      }
    } catch (error) {
      console.error("Error checking production status:", error);
      return false; // Default to false if there's an error
    }
  }


  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}