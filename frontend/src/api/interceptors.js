import axios from "axios";
import { logout, refreshUserToken } from "../redux/auth/authOperations";
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Dispatch the refresh token action
        const result = await store.dispatch(refreshUserToken());

        // Update the token in the header and retry the request
        const newToken = result.payload.accessToken;
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., log the user out)
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);