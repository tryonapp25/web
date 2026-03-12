import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { BusinessProvider } from "./businessContext";
import { SocketContext } from "./socketContext";
import { UserContext } from "./userContext";
import Socket from "../model/socket";

export default function BusinessProtection() {
  const location = useLocation();
  const navigate = useNavigate();

  const socketContext = useContext(SocketContext);
  const { connected } = useContext(SocketContext);

  const { publicUser } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));

  // ----------------------------
  // 1) SOCKET: connect once
  // ----------------------------
  const socketStartedRef = useRef(false);

  useEffect(() => {
    // Avoid double-run in React StrictMode (dev) + any re-renders
    if (socketStartedRef.current) return;

    // If already connected, no need to create/connect
    if (connected) {
      socketStartedRef.current = true;
      console.log("Socket already connected");
      return;
    }

    socketStartedRef.current = true;

    const socket = new Socket(socketContext);
    socket.connect();

    console.log("Connecting socket (business protection)...");
  }, [connected, socketContext]);

  // ----------------------------
  // 2) BUSINESS SETUP CHECK
  // ----------------------------
  const lastCheckKeyRef = useRef(""); // stops repeated checks for same state

  useEffect(() => {
    if (!publicUser) return;

    // Build a small "key" so we only re-run when meaningful input changes
    const business = publicUser?.business;
    const key = JSON.stringify({
      path: location.pathname,
      userId: publicUser?.id || publicUser?._id || null,
      isCustomer: publicUser?.isCustomer || false,
      business: business
        ? {
            name: business.name || "",
            address: business.address || "",
            phone: business.phone || "",
            email: business.email || "",
            openHoursKeys: business.openHours ? Object.keys(business.openHours) : [],
          }
        : null,
    });

    if (lastCheckKeyRef.current === key) return;
    lastCheckKeyRef.current = key;

    try {
      checkBusinessSetup();
    } catch (err) {
      console.error("Error during checkBusinessSetup", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, publicUser]);

  const checkBusinessSetup = () => {
    if(location.pathname === "/business/setting") return;
    // Only do this for business users or customers (your original logic)
    if (publicUser?.business || publicUser?.isCustomer === true) {
      const isCompleted = isCompletedSetup(publicUser?.business);
      console.log("Business setup completed?: ", isCompleted);

      // IMPORTANT: don't navigate if already there (prevents loop)
      if (!isCompleted && location.pathname !== "/business/setting") {
        navigate("/business/setting", { replace: true });
      }
    }
  };

  const isCompletedSetup = (business) => {
    console.log("Checking business setup:", business);

    if (!business) return false;
    if (!business.name) return false;
    if (!business.address) return false;
    if (!business.phone) return false;
    if (!business.email) return false;
    if (!business.openHours || Object.keys(business.openHours).length === 0) return false;

    return true;
  };

  // ----------------------------
  // 3) ROUTE PROTECTION
  // ----------------------------
  if (!user) return <Navigate to="/business/login" replace />;
  if (!user?.isCustomer) return <Navigate to="/business/payment" replace />;

  return (
    <BusinessProvider>
      <Outlet />
    </BusinessProvider>
  );
}