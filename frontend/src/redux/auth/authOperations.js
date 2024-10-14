import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../utils/tokenUtils.js";
import axiosInstance from "../../api/interceptors.js";

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
      const response = await axiosInstance.post("/auth/register", userData);
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
      const response = await axiosInstance.post("/auth/login", formData);
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
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      removeAccessToken();
      removeRefreshToken();
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshCurrentUser = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return rejectWithValue("Unable to fetch user");
    }

    try {
      const { data } = await axiosInstance.get("/auth/current", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
