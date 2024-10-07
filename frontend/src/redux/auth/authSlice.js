import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../utils/tokenUtils.js";
import { login, logout, register, refreshUserToken } from "./authOperations.js";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    name: null,
    email: null,
  },
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  isLoggedIn: !!getAccessToken(),
  isLoading: false,
  isRefreshing: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Registration
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Registration successful!";
      setAccessToken(action.payload.accessToken);
      setRefreshToken(action.payload.refreshToken);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Login successful!";
      setAccessToken(action.payload.accessToken);
      setRefreshToken(action.payload.refreshToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Token Refresh
    builder.addCase(refreshUserToken.pending, (state) => {
      state.isRefreshing = true;
    });
    builder.addCase(refreshUserToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isRefreshing = false;
      setAccessToken(action.payload.accessToken);
      setRefreshToken(action.payload.refreshToken);
    });
    builder.addCase(refreshUserToken.rejected, (state, action) => {
      state.isRefreshing = false;
      state.error = action.payload;
      state.accessToken = null;
      state.isLoggedIn = false;
    });
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.success = "Logout successful!";
      removeAccessToken();
      removeRefreshToken();
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload || "Logout failed";
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const authReducer = authSlice.reducer;
