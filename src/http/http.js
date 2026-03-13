import axios from "axios";

const SERVER_IP = import.meta.env.VITE_SERVER_IP;

const http = axios.create({
  baseURL: SERVER_IP,
  withCredentials: true,
});


// Add access token to every request
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


// Handle expired token
http.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        const refreshResponse = await axios.post(
          `${SERVER_IP}/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;

        // Save new access token
        localStorage.setItem("token", newToken);

        // Update header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry original request
        return http(originalRequest);

      } catch (refreshError) {

        // Refresh failed → logout
        localStorage.removeItem("token");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;