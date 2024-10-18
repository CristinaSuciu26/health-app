import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors.js";
import localStorageService from "../../utils/tokenUtils.js";

export const setAuthHeader = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

// Register action
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      const { accessToken, refreshToken } = response.data;

      localStorageService.setTokens({ accessToken, refreshToken });

      setAuthHeader(accessToken);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Login action
export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const { accessToken, refreshToken } = response.data;

      localStorageService.setTokens({ accessToken, refreshToken });

      setAuthHeader(accessToken);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorageService.getAccessToken();
      if (!token) {
        return rejectWithValue("No access token available for logout.");
      }

      // Call the API to logout
      const response = await axiosInstance.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // clearAuthHeader();
      // localStorageService.clearTokens();

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
