import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      return Promise.reject(
        new Error("Network error please check your connection"),
      );
    }

    const token = useAuthStore.getState().user?.token;

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }

    if (!navigator.onLine || (axios.isAxiosError(error) && !error.response)) {
      new Error("Network error: Please check your internet connection.");
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
