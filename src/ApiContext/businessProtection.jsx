import { Navigate, Outlet } from "react-router-dom";
import { BusinessProvider } from "./businessContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { UserContext } from "./userContext";
import { getFeatureFlags } from "../featureFlags/featureFlags";
import handleBusinessSocketConnection from "../utils/socket_businessConnection";

export default function BusinessProtection() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { publicUser } = useContext(UserContext);
  const { connected, setSocketEnabled, connectBusiness } = useContext(SocketContext);
  

  // Prevent duplicate connect attempts (including StrictMode dev double-mount)
  const startedRef = useRef(false);

  useEffect(() => {
    // Don’t connect if already connected
    if (connected) return;

    // Wait until you actually have what you need
    if (!publicUser) return;

    // Only attempt once per component lifetime
    if (startedRef.current) return;
    startedRef.current = true;
    const flag = getFlag(); // Preload flag for later use in business pages
    if(!flag) return;

    try {
      handleBusinessSocketConnection({
        publicUser,
        setSocketEnabled,
        connectBusiness,
      });
      console.log("BusinessProtection: Attempting to connect to business socket...");
    } catch (err) {
      console.error("Error handling business socket connection:", err);
    }
  }, [publicUser, connected, setSocketEnabled, connectBusiness]);


  const getFlag = () => {
    const flag = getFeatureFlags("ORDER_FEATURE");
    return flag || false; // Default to false if flag is undefined
  }

  // Do redirects AFTER hooks (avoids Rules of Hooks violations)
  if (!user) return <Navigate to="/" replace />;
  if (!user?.isCustomer) return <Navigate to="/business/payment" replace />;

  return (
    <BusinessProvider>
      <Outlet />
    </BusinessProvider>
  );
}