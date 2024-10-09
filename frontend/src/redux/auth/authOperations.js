import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/apiConfig.js";
import axios from "axios";
import { getRefreshToken } from "../../utils/tokenUtils.js";

export const setAuthHeader = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete axios.defaults.headers.common["Authorization"];
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
      setAuthHeader(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    await axiosInstance.post("/logout", null, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    clearAuthHeader();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return { message: "Logged out successfully" };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return thunkAPI.rejectWithValue("No refresh token available");
      }

      const response = await axiosInstance.post("/auth/refresh", {
        refreshToken,
      });
      const { accessToken } = response.data;
      return { accessToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
