import { Navigate, Outlet, useLocation } from "react-router-dom";
import { BusinessProvider } from "./businessContext";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "./socketContext";
import { UserContext } from "./userContext";
import Socket from "../model/socket";

export default function BusinessProtection() {
  const location = useLocation(); // ⭐ IMPORTANT
  const startupRef = useRef(false);
  const socketContext = useContext(SocketContext);
  const { publicUser } = useContext(UserContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { connected } = useContext(SocketContext);

  // ✅ This runs EVERY time route changes
  useEffect(() => {
    if(startupRef.current) return;
    startupRef.current = true;
    if(connected) return console.log("Socket already connected"); // ✅ prevent multiple connections
    const socket = new Socket(publicUser, socketContext);
    socket.connect();
    //handleCheckSocketConnection();
    console.log("Connecting to socket on business route change...");

  }, [location.pathname]);


  const handleCheckSocketConnection = () => {
    if(connected){
      console.log("Socket already connected");
      return;
    } // ✅ prevent multiple connections
    const id = setInterval(async () => {
      console.log("Socket disconnected. Attempting to reconnect...");
      console.log("Connected:", connected);
      const socket = new Socket(publicUser, socketContext);
      socket.connect();
    }, 20000); // Check every 15 seconds

    return () => clearInterval(id);
  }

  if (!user) return <Navigate to="/" replace />;
  if (!user?.isCustomer) return <Navigate to="/business/payment" replace />;


  return (
    <BusinessProvider>
      <Outlet />
    </BusinessProvider>
  );
}