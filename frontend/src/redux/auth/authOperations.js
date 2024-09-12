import { createAsyncThunk } from "@reduxjs/toolkit";
import { removeTokens, storeTokens } from "./tokenUtils";
import axiosInstance from "../../api/apiConfig.js";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/register`, userData);
      const { accessToken, refreshToken } = response.data;

      storeTokens(accessToken, refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/login`, formData);
      const { accessToken, refreshToken } = response.data;

      storeTokens(accessToken, refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.auth.token || localStorage.getItem("accessToken");
    try {
      await axiosInstance.post(
        `/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      removeTokens();
      return { message: "Logged out successfully" };
    } catch (error) {
      console.log("Error in logout asyncThunk:", error);
      return rejectWithValue(error.response.data.message);
    }
  }
);
