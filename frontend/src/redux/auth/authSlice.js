import { login, logout, register, refreshUserToken } from "./authOperations.js";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    name: null,
    email: null,
  },
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
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
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
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
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addCase(refreshUserToken.rejected, (state, action) => {
      state.isRefreshing = false;
      state.error = action.payload;
      state.accessToken = null;
      state.isLoggedIn = false;
      // Clear tokens if refresh fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    });
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.success = "Logout successful!";
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload || "Logout failed";
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const authReducer = authSlice.reducer;
