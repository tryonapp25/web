import { createContext, useState, useRef } from "react";
import { HandeleSocketConnect } from "../utils/socketio";
import http from "../http/http";
import { useContext } from "react";
import { UserContext } from "./userContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const { publicUser } = useContext(UserContext);
  const [connected, setConnected] = useState(false);
  const [orderFeatureEnabled, setOrderFeatureEnabled] = useState(false);
  const listenersRef = useRef(null);

  async function connectBusiness() {
    try {
      if(publicUser?.isCustomer === false) {
        console.log("User is not a business, skipping socket connection.");
        return null;
      }
      const enabled = await checkEnableOrderOnlineFeatureForBusiness(publicUser?.business?.id).catch(err => {
        console.error("Error checking business feature flag:", err);
        return false; // Default to false on error
      }); 
      setOrderFeatureEnabled(enabled);
      if(!enabled) return;
      
      const newSocket = await HandeleSocketConnect();
      detachListeners();
      socketRef.current = newSocket;
      attachListeners(socketRef.current);
      console.log("Business socket initialized...");
      return socketRef.current;
    } catch (err) {
      throw err;
    }
  }

  async function connectGuest() {
    try {
      if(publicUser?.isCustomer === false) {
        console.log("User is not a business, skipping socket connection.");
        return null;
      }
      const newSocket = await HandeleSocketConnect();
      detachListeners();
      socketRef.current = newSocket;
      attachListeners(socketRef.current);
      console.log("Guest socket initialized...");
      return socketRef.current;
    } catch (err) {
      throw err;
    }
  }
  


  function disconnect() {
    try {
      if (socketRef.current) {
        detachListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    } finally {
      setConnected(false);
    }
  }

  function attachListeners(socket) {
    if (!socket) return;
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onConnectError = (err) => console.error("Socket connect_error", err);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    listenersRef.current = { socket, onConnect, onDisconnect, onConnectError };
    // initialize state based on current socket status
    setConnected(!!socket.connected);
  }

  function detachListeners() {
    const l = listenersRef.current;
    if (!l?.socket) return;
    try {
      l.socket.off("connect", l.onConnect);
      l.socket.off("disconnect", l.onDisconnect);
      l.socket.off("connect_error", l.onConnectError);
    } catch (e) {
      // ignore
    }
    listenersRef.current = null;
  }

  const checkEnableOrderOnlineFeatureForBusiness = async (businessId) => {
      try {
          const res = await http.get(`/business/feature/ONLINE_ORDERING/business/${businessId}`);
          const enabled = res.data?.data ?? false;
          return enabled;
      } catch (err) {
          console.error("Error checking permissions:", err);
          return false;
      }
  }

  return (
    <SocketContext.Provider
      value={{
        socketRef,
        connected,
        connectBusiness,
        connectGuest,
        disconnect,
        orderFeatureEnabled,
        setOrderFeatureEnabled,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
