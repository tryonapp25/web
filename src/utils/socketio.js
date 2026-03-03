import { io } from "socket.io-client";
import axios from "axios";
import httpMessage from "../http/httpMessage";

const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER;
const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;
const publicCode = new URLSearchParams(window.location.search).get("public");

export async function HandeleSocketConnectForBusiness() {
  try {
    const socketIO = io(SOCKET_SERVER, {
      transports: ["polling", "websocket"],
      forceNew: true,
      reconnection: true,
      auth: {
        token: sessionStorage.getItem("token"),
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


function generateRandomString(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export async function genGuestToken() {
    try {
        const res = await axios.get(
          `${ORDER_SERVER}/gen-guest-token/${publicCode ?? generateRandomString()}`
        );
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
      sessionStorage.setItem("receiptToken", res.data.receiptToken);
      return {success: true, message: res.data.message || "Order placed successfully", data: res.data.data || null, receiptToken: res.data.receiptToken || null};
    }
  } catch (err) {
    console.error("Error sending order:", err);
    return {success: false, error: httpMessage(err)};
  }
}