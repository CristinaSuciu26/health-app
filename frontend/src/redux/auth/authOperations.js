import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors.js";
// import localStorageService from "../../utils/tokenUtils.js";

// Register action
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("refreshToken", refreshToken);

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

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

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
      // await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");

      localStorage.removeItem("refreshToken");
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
