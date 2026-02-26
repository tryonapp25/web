import { Outlet } from "react-router-dom";
import { UserProvider } from "./userContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";

import connectToSocket from "../utils/renderProductionConnection";

export default function RenderProductionSocketConnection() {
  const { connected, setSocketEnabled, connectBusiness } = useContext(SocketContext);

  // Tracks whether THIS component instance already started a connection attempt.
  const startedRef = useRef(false);

  useEffect(() => {
    // If already connected, or we already started once, do nothing.
    if (connected) return;
    if (startedRef.current) return;

    startedRef.current = true;

    try {
      connectToSocket(connectBusiness, connected, setSocketEnabled);
      console.log("RenderProductionSocketConnection: Attempting to connect to socket...");
    } catch (err) {
      console.error("Error in connectToSocket", err);
    }
  }, [connected, connectBusiness, setSocketEnabled]);

  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}