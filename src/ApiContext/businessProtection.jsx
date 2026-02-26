import { Navigate, Outlet } from "react-router-dom";
import { BusinessProvider } from "./businessContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { UserContext } from "./userContext";
import handleBusinessSocketConnection from "../utils/businessConnection";

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

  // Do redirects AFTER hooks (avoids Rules of Hooks violations)
  if (!user) return <Navigate to="/" replace />;
  if (!user?.isCustomer) return <Navigate to="/business/payment" replace />;

  return (
    <BusinessProvider>
      <Outlet />
    </BusinessProvider>
  );
}