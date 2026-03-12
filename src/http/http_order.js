import axios from "axios";
import { genGuestToken } from "../utils/socketio";

const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;

const http_order = axios.create({
  baseURL: ORDER_SERVER,
});

http_order.interceptors.request.use(
  async (config) => {
    let token;
    // First check sessionStorage
    token = sessionStorage.getItem("token");
    if(!token) {
      // If not found, check localStorage
      await genGuestToken().then((guestToken) => {
        token = guestToken;
      });
    }
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http_order;
