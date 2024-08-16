import { getCookie } from "@/lib/utils";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": "",
  },
  withCredentials: true,
};
const apiClient = axios.create(axiosConfig);

apiClient.interceptors.request.use(
  (config) => {
    // append the access token csrf to every request header
    config.headers["X-CSRF-TOKEN"] = getCookie("csrf_access_token") || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
