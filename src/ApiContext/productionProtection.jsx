import { Outlet, useLocation } from "react-router-dom";
import { UserProvider } from "./userContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { BusinessContext } from "./businessContext";
import ThemeContext from "./themeContext";

import http from "../http/http";
import { t } from "i18next";
const publicCode = new URLSearchParams(window.location.search).get("public");



export default function ProductionProtection() {
  const location = useLocation(); // ⭐ IMPORTANT
  const startupRef = useRef(false);
  const { setOrderFeatureEnabled } = useContext(SocketContext);
  const { setIsBusinessOpen } = useContext(BusinessContext);
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (startupRef.current) return;
    startupRef.current = true;
    
    if (location.pathname.startsWith("/menubook")) {
      productionMenuBookCheck();
      return;
    };
    productionTemplateCheck();
  }, [location.pathname]);

  const productionTemplateCheck = async () => {
    try {
      const response = await http.get(`/production/checkout-template/publicCode/${publicCode}/flag/ORDER_FEATURE/businessFeature/ONLINE_ORDERING`);
      if(response.data.success){
        const { orderFeatureEnabled, isBusinessOpen, theme, flag } = response.data.data;
        if(flag && orderFeatureEnabled) setOrderFeatureEnabled(true);
        if(isBusinessOpen) setIsBusinessOpen(isBusinessOpen);
        if(theme) setTheme(theme);
        console.log("Production check result:", response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error("Error checking production status:", error);
      return false; // Default to false if there's an error
    }
  }

  const productionMenuBookCheck = async () => {
    try {
      const response = await http.get(`/production/checkout-menubook/publicCode/${publicCode}/flag/ORDER_FEATURE/businessFeature/ONLINE_ORDERING`);
      if(response.data.success){
        const { orderFeatureEnabled, isBusinessOpen, theme, flag } = response.data.data;
        if(flag && orderFeatureEnabled) setOrderFeatureEnabled(true);
        if(isBusinessOpen) setIsBusinessOpen(isBusinessOpen);
        if(theme) setTheme(theme);
        console.log("Production check result:", response.data.data);
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