import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { BusinessProvider } from "./businessContext";
import { SocketContext } from "./socketContext";
import { UserContext } from "./userContext";
import Socket from "../model/socket";

export default function BusinessProtection() {
  const location = useLocation();
  const navigate = useNavigate();

  const socketContext = useContext(SocketContext);
  const { connected } = socketContext;

  const { publicUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ----------------------------
  // 0) LOAD USER FROM LOCALSTORAGE
  // ----------------------------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // ----------------------------
  // 1) SOCKET: connect once
  // ----------------------------
  const socketStartedRef = useRef(false);

  useEffect(() => {
    if (loadingUser) return;
    if (!user?.uid) return;

    // Avoid double-run in React StrictMode (dev) + re-renders
    if (socketStartedRef.current) return;

    // If already connected, do nothing
    if (connected) {
      socketStartedRef.current = true;
      console.log("Socket already connected");
      return;
    }

    socketStartedRef.current = true;

    const socket = new Socket(socketContext);
    socket.connect();

    console.log("Connecting socket (business protection)...");
  }, [connected, socketContext, loadingUser, user]);

  // ----------------------------
  // 2) BUSINESS SETUP CHECK
  // ----------------------------
  const lastCheckKeyRef = useRef("");

  useEffect(() => {
    if (loadingUser) return;
    if (!user?.uid) return;
    if (!publicUser) return;

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
            openHoursKeys: business.openHours
              ? Object.keys(business.openHours)
              : [],
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
  }, [location.pathname, publicUser, loadingUser, user]);

  const checkBusinessSetup = () => {
    if (location.pathname === "/business/setting") return;

    if (publicUser?.business || publicUser?.isCustomer === true) {
      const isCompleted = isCompletedSetup(publicUser?.business);
      console.log("Business setup completed?:", isCompleted);

      if (!isCompleted) {
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
    if (!business.openHours || Object.keys(business.openHours).length === 0) {
      return false;
    }

    return true;
  };

  // ----------------------------
  // 3) WAIT UNTIL USER IS LOADED
  // ----------------------------
  if (loadingUser) {
    return <div>Loading...</div>;
  }

  // ----------------------------
  // 4) ROUTE PROTECTION
  // ----------------------------
  console.log("BusinessProtection - user:", user);

  if (!user?.uid) {
    return <Navigate to="/business/login" replace />;
  }

  if (!user?.isCustomer) {
    return <Navigate to="/business/payment" replace />;
  }

  return (
    <BusinessProvider>
      <Outlet />
    </BusinessProvider>
  );
}