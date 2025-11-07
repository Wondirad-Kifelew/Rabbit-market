import axios from "axios";
const api =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;
const axiosInstance = axios.create({
  baseURL: api,
  withCredentials: true, //use cookies
});

export default axiosInstance;
