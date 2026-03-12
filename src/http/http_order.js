import axios from "axios";

const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;

const http_order = axios.create({
  baseURL: ORDER_SERVER,
});

http_order.interceptors.request.use(
  (config) => {
    let token;
    // First check sessionStorage
    token = sessionStorage.getItem("token");
    if(token){
      localStorage.setItem("token", token); // Sync token to localStorage
    }
    if(!token){
      token = localStorage.getItem("token"); // Check localStorage if not in sessionStorage
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
