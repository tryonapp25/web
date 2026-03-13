import axios from "axios";

const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;


const http_order = axios.create({
  baseURL: ORDER_SERVER,
  withCredentials: true,
});

http_order.interceptors.request.use(
  (config) => {
    let token;

    // first check sessionStorage
    token = sessionStorage.getItem("token");

    if (token) {
      localStorage.setItem("token", token);
    }

    if (!token) {
      token = localStorage.getItem("token");
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


http_order.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        // call refresh endpoint (auth server)
        const refresh = await axios.post(
          `${import.meta.env.VITE_SERVER_IP}/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refresh.data.token;

        // save new token
        localStorage.setItem("token", newToken);
        sessionStorage.setItem("token", newToken);

        // update header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // retry original request
        return http_order(originalRequest);

      } catch (err) {

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default http_order;