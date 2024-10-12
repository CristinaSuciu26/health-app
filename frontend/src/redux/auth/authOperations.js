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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await axiosInstance.post("/refresh", { refreshToken });

        console.log("New access token:", data.accessToken);
        console.log("New refresh token:", data.refreshToken);

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        setAuthHeader(data.accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
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
      const { data } = await axiosInstance.get("/current", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      console.log("User data from API:", data);

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
