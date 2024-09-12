import store from "../redux/store.js";
import { removeTokens } from "../redux/auth/tokenUtils.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./apiConfig.js";

// Refresh token logic
export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const response = await axiosInstance.post(`/refresh`, { refreshToken });
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Request interceptor for attaching the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors and refreshing tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { status } = error.response || {};

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { dispatch } = store;

      try {
        await dispatch(refresh()).unwrap();
        const newToken = localStorage.getItem("accessToken");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        removeTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
