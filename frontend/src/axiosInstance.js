import axios from "axios";
// import { trusted } from "mongoose";
// const api = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true, //later use cookies
});

export default axiosInstance;
