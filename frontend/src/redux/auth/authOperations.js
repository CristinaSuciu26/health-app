import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../utils/tokenUtils.js";

const API_URL = "http://localhost:3000/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the response is 401 and the request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();  // Get the refresh token from storage
      if (!refreshToken) {
        return Promise.reject(error); // No refresh token, can't retry
      }

      try {
        // Request a new token using the refresh token
        const { data } = await axiosInstance.post("/refresh", { refreshToken });

        // Log the new tokens
        console.log("New access token:", data.accessToken);
        console.log("New refresh token:", data.refreshToken);

        // Store the new tokens in localStorage (or cookies)
        setAccessToken(data.accessToken);  // Store the new access token
        setRefreshToken(data.refreshToken); // Store the new refresh token (if provided)
        
        // Set the Authorization header to use the new access token
        setAuthHeader(data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest); // Retry the request with new token
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Return error if it's not a 401 or token refresh fails
  }
);


export const setAuthHeader = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/register", userData);
      const { accessToken, refreshToken } = response.data;
      setAuthHeader(accessToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", formData);
      const { accessToken, refreshToken } = response.data;
      setAuthHeader(accessToken);
      console.log("Setting access token:", accessToken);
      console.log("Setting refresh token:", refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    console.log("Token used for logout:", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (!token) {
      return rejectWithValue("No access token available for logout.");
    }
    try {
      const response = await axiosInstance.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshCurrentUser = createAsyncThunk(
  "auth/refresh",
  async (_, rejectWithValue) => {
    const accessToken = getAccessToken();

    if (accessToken === null) {
      return rejectWithValue.rejectWithValue("Unable to fetch user");
    }

    try {
      const { data } = await axiosInstance.get("/current");
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        removeAccessToken();
        removeRefreshToken();
      }
      return rejectWithValue(error.message);
    }
  }
);
