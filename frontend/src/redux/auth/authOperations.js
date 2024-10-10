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
        const { data } = await axiosInstance.post("/refresh", {
          refreshToken,
        });

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
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
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
      // setAuthHeader(accessToken);
      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("refreshToken", refreshToken);
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
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.accessToken;

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
      console.error("Logout failed:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return thunkAPI.rejectWithValue("No refresh token available");
      }
      setAuthHeader(refreshToken);
      const { data } = await axiosInstance.post("/refresh", {
        refreshToken,
      });
      setAccessToken(data.accessToken);
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      return data.response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
