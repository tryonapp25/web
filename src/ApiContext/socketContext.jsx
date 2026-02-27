import React, { createContext, useEffect, useState, useRef } from "react";
import {
  HandeGuestSocketConnect,
  HandeleSocketConnectForBusiness,
  sendOrder as sendOrderUtil,
} from "../utils/socketio";
import http from "../http/http";

const publicCode = new URLSearchParams(window.location.search).get("public");

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [socketEnabled, setSocketEnabled] = useState(false);
  const listenersRef = useRef(null);

  async function connectGuest() {
    try {
      const enabled = await checkEnableOrderOnlineFeatureForGuest();
      setSocketEnabled(enabled);
      if (!enabled) return;

      const newSocket = await HandeGuestSocketConnect();
      // detach previous listeners (if any) and attach to the new socket
      detachListeners();
      socketRef.current = newSocket;
      attachListeners(socketRef.current);
      return socketRef.current;
    } catch (err) {
      throw err;
    }
  }

  async function connectBusiness(user) {
    try {
      const enabled = await checkEnableOrderOnlineFeatureForBusiness(user?.business?.id).catch(err => {
        console.error("Error checking business feature flag:", err);
        return false; // Default to false on error
      });
      setSocketEnabled(enabled);
      if(!enabled) return;
      
      const newSocket = await HandeleSocketConnectForBusiness(user);
      detachListeners();
      socketRef.current = newSocket;
      attachListeners(socketRef.current);
      console.log("Business socket initialized...");
      return socketRef.current;
    } catch (err) {
      throw err;
    }
  }

  async function sendOrder(data) {
    try {
      const res = await sendOrderUtil(socketRef, data);
      return res;
    } catch (err) {
      return { success: false, error: err?.message || err };
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

  const checkEnableOrderOnlineFeatureForGuest = async () => {
      try {
          const response = await http.get(`/business/feature/ORDER_ONLINE/publicCode/${publicCode}`);
          return response.data.data || false;
      } catch (error) {        console.error("Error fetching business order online feature status:", error);
          return false; // Default to false if there's an error
      }
  }

  const checkEnableOrderOnlineFeatureForBusiness = async (businessId) => {
      try {
          const res = await http.get(`/business/feature/ORDER_ONLINE/business/${businessId}`);
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
        connectGuest,
        connectBusiness,
        sendOrder,
        disconnect,
        socketEnabled,
        setSocketEnabled,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
