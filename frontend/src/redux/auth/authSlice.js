import { login, logout, register } from "./authOperations.js";
import { refresh } from "../../api/axiosWithAuth.js";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    name: null,
    email: null,
  },
  token: null,
  isLoggedIn: false,
  isLoading: false,
  isRefreshing: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // Registration
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Registration successful!";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Registration failed";
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Login successful!";
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Login failed";
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = { name: null, email: null };
      state.token = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.success = "Logout successful!";
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload || "Logout failed";
      state.isLoading = false;
    });

    // Token Refresh
    builder.addCase(refresh.pending, (state) => {
      state.isRefreshing = true;
      state.error = null;
    });
    builder.addCase(refresh.fulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.isRefreshing = false;
    });
    builder.addCase(refresh.rejected, (state, action) => {
      state.error = action.payload || "Token refresh failed";
      state.isRefreshing = false;
    });
  },
});

export const authReducer = authSlice.reducer;
