import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "./constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        const { token } = JSON.parse(storedUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing user token", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  get: (url: string, config?: any) => axiosInstance.get(url, config),
  post: (url: string, data: any, config?: any) =>
    axiosInstance.post(url, data, config),
  put: (url: string, data: any, config?: any) =>
    axiosInstance.put(url, data, config),
  delete: (url: string, config?: any) => axiosInstance.delete(url, config),
};
