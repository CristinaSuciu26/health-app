import { refreshUserToken } from "../redux/auth/authOperations";
import store from "../redux/store";
import axiosInstance from "./apiConfig";
// Add request interceptor to include the access token in the headers

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and logout
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return the response as is
  },
  async (error) => {
    console.error("Response error:", error.response);
    const originalRequest = error.config;

    // Handle token expiration (401 Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("Token expired, attempting to refresh...");
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Attempt to refresh the token
        console.log("Attempting to refresh token...");
        await store.dispatch(refreshUserToken());
        console.log("Token refreshed successfully");

        // Retry the original request after refreshing the token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        store.dispatch({ type: "auth/logout" });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
