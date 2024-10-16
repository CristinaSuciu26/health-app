import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors.js";
import { selectAccessToken } from "./authSelectors.js";

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
      const { accessToken } = response.data;

      setAuthHeader(accessToken);

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
      const { accessToken } = response.data;
      setAuthHeader(accessToken);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = selectAccessToken(state);
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
      clearAuthHeader();
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
