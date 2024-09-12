import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
