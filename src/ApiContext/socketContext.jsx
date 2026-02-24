import React, { createContext, useEffect, useState, useRef } from "react";
import {
  getGuestToken,
  getBusinessToken,
  HandeSocketConnect,
  HandeleSocketConnectForBusiness,
  sendOrder as sendOrderUtil,
} from "../utils/socketio";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef(null);

  async function connectGuest(publicCode) {
    try {
      // underlying util will set token in sessionStorage and return socket instance
      const newSocket = await HandeSocketConnect(publicCode);
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

  return (
    <SocketContext.Provider
      value={{
        socketRef,
        connected,
        connectGuest,
        connectBusiness,
        sendOrder,
        disconnect,
        getGuestToken,
        getBusinessToken,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
