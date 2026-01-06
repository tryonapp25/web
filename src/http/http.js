import axios from "axios";

const SERVER_IP = import.meta.env.VITE_SERVER_IP;

const http = axios.create({
  baseURL: SERVER_IP,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
