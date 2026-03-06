import { io } from "socket.io-client";
import axios from "axios";
import httpMessage from "../http/httpMessage";
import { setupNotifications } from "../firebase";

const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER;
const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;
//const publicCode = new URLSearchParams(window.location.search).get("public");

function getToken() {
  let token = sessionStorage.getItem("token");
  if (!token) {
    token = localStorage.getItem("token");
  }
  return token;
}

export async function HandeleSocketConnect() {
  try {
    const socketIO = io(SOCKET_SERVER, {
      transports: ["polling", "websocket"],
      forceNew: true,
      reconnection: true,
      auth: {
        token: getToken(),
      },
    });

    return await new Promise((resolve, reject) => {
      let timeoutId;

      const cleanup = () => {
        socketIO.off("connect", onConnect);
        socketIO.off("connect_error", onError);
        socketIO.off("disconnect", onDisconnect);
        clearTimeout(timeoutId);
      };

      const onConnect = () => {
        cleanup();
        console.log("Connected:", socketIO.id);
        resolve(socketIO);
      };

      const onError = (err) => {
        cleanup();
        console.error("Socket connect_error:", err);
        reject(err);
      };

      const onDisconnect = (reason) => {
        console.log("Disconnected from server:", reason);
      };

      socketIO.once("connect", onConnect);
      socketIO.once("connect_error", onError);
      socketIO.on("disconnect", onDisconnect);

      timeoutId = setTimeout(() => {
        if (!socketIO.connected) {
          cleanup();
          reject(new Error("Business socket connection timeout"));
        }
      }, 15000);
    });

  } catch (err) {
    console.error("Error during business socket connection:", err);
    throw err;
  }
}



function generateGuestId(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

async function getFCMToken() {
  let token = sessionStorage.getItem("fcmToken");
  if (token) return token;

  try {
    const newToken = await setupNotifications();
    sessionStorage.setItem("fcmToken", newToken);
    console.log("FCM token stored in sessionStorage:", newToken);
    return newToken;
  } catch (err) {
    console.error("Failed to get FCM token:", err);
    return null;
  }
}

export async function genGuestToken() {
    try {
        console.log("Generating guest token...");
        const fcmToken = await getFCMToken();
        if(!fcmToken) {
          console.error("No FCM token available for guest token generation");
          return null;
        }
        const res = await axios.get(`${ORDER_SERVER}/gen-guest-token`,{
          params: {
            guestId: fcmToken,
          }
        });
        if(res.data?.success){
            localStorage.setItem("token", res.data.token); // Store in localStorage for persistence
            return res.data.token;
        }
    } catch (err) {
        console.error("Failed to get guest token:", err);
        throw err;
    }
}

export const sendOrder = async (order) => {
  try {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = await genGuestToken();
    }
    if(!token) {
      console.error("No token available for sending order");
      return false;
    }

    const res = await axios.post(`${ORDER_SERVER}/new-order`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(res.data.success){
      console.log("Order sent successfully:");
      localStorage.setItem("token", res.data.token);
      return {success: true, message: res.data.message || "Order placed successfully", data: res.data.data || null, token: res.data.token || null};
    }
  } catch (err) {
    console.error("Error sending order:", err);
    return {success: false, error: httpMessage(err)};
  }
}