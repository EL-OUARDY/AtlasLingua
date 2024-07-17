import { getCookie } from "@/lib/helpers";
import axios, { CanceledError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": "",
  },
  withCredentials: true,
};
const apiClient = axios.create(axiosConfig);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error instanceof CanceledError) return Promise.reject(error);

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // try to refresh the access token
      axiosConfig.headers["X-CSRF-TOKEN"] =
        getCookie("csrf_refresh_token") || "";
      const request = axios.create(axiosConfig).post("/auth/refresh");
      request.then(() => {
        // recall the original request with the new token
        return axios(originalRequest);
      });
    }
    return Promise.reject(error);
  },
);

export default apiClient;
