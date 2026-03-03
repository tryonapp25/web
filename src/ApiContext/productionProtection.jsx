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

    orderFeatureEnabledChecker().then((isEnabled) => {
      setOrderFeatureEnabled(isEnabled);
      console.log("Order feature enabled:", isEnabled);
    }).catch((error) => {
      console.error("Error checking order feature status:", error);
    });

    checkFeatureFlag().then((isEnabled) => {
      console.log("Feature flag check completed. ORDER_FEATURE enabled:", isEnabled);
    }).catch((error) => {
      console.error("Error checking feature flag:", error);
    });
  }, [location.pathname]);

  const orderFeatureEnabledChecker = async () => {
      try {
          const response = await http.get(`/business/feature/ORDER_ONLINE/publicCode/${publicCode}`);
          return response.data.data || false;
      } catch (error) {        console.error("Error fetching business order online feature status:", error);
          return false; // Default to false if there's an error
      }
  }

  const checkFeatureFlag = async () => {
    const isEnabled = await getFeatureFlags("ORDER_FEATURE").catch((error) => {      
      console.error("Error fetching feature flags:", error);
      setOrderFeatureEnabled(false); // Default to false on error
      return false;
    });
    setOrderFeatureEnabled(isEnabled);
    return isEnabled;
  }

  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}