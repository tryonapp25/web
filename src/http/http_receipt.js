import axios from "axios";

const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;

const http_receipt = axios.create({
  baseURL: ORDER_SERVER,
});

http_receipt.interceptors.request.use(
  (config) => {
    const token  = localStorage.getItem("receiptToken");
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http_receipt;
