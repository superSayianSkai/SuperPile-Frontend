import axios from "axios";

const apiClient = axios.create({
  //   baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export default apiClient;
