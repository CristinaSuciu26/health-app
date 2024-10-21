import axios from "axios";
import localStorageService from "../utils/tokenUtils.js";
import setTokens from "../utils/tokenUtils.js";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Function to refresh token
const refreshToken = async (dispatch) => {
  const refreshToken = localStorageService.getRefreshToken();
  console.log("Refresh Token:", refreshToken);

  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axiosInstance.post("/auth/refresh", {
    refreshToken: localStorageService.getRefreshToken(),
  });

  // Update localStorage with new tokens
  localStorageService.setTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  });

  // Dispatch action to update Redux store
  dispatch(setTokens(response.data.accessToken)); // Dispatch directly

  return response.data.accessToken;
};

// Request interceptor
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
      try {
        // Pass the dispatch directly
        const newAccessToken = await refreshToken(originalRequest.dispatch);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        return Promise.reject(refreshError); // If refresh fails, reject the request
      }
    }

    return Promise.reject(error);
  }
);

export const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Pass the store's dispatch function when refreshing token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshToken(store.dispatch); // Use store.dispatch
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
          return Promise.reject(refreshError); // If refresh fails, reject the request
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
