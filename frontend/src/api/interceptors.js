import axios from "axios";
import localStorageService from "../utils/tokenUtils.js"; 
import { clearAuthHeader, setAuthHeader } from "../redux/auth/authOperations.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken(); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // Handle token expiration
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorageService.getRefreshToken();
  
        if (!refreshToken) {
          // No refresh token available, log out
          clearAuthHeader();
          localStorageService.clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }
  
        try {
          // Attempt to refresh the token
          const { data } = await axios.post("/api/auth/refresh", {
            token: refreshToken,
          });
  
          // Update tokens in localStorage
          localStorageService.setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
  
     
          setAuthHeader(data.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
      
          clearAuthHeader();
          localStorageService.clearTokens();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance;
