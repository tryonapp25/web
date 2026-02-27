import { Outlet, useLocation } from "react-router-dom";
import { UserProvider } from "./userContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { UserContext } from "./userContext";

import Socket from "../model/socket";


export default function ProductionProtection() {
  const location = useLocation(); // ⭐ IMPORTANT
  const startupRef = useRef(false);
  const socketContext = useContext(SocketContext);
  const { publicUser } = useContext(UserContext);
  const { connected } = useContext(SocketContext);

  useEffect(() => {
    // If already connected, or we already started once, do nothing.
    if (connected) return;
    if (startupRef.current) return;
    startupRef.current = true;

    const socket = new Socket(publicUser, socketContext);
    socket.connect();
    console.log("Connecting to socket on route change...");
  }, [location.pathname]);

  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}