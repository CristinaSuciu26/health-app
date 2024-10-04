import { login, logout, register, refreshUserToken } from "./authOperations.js";
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
  reducers: {},
  extraReducers: (builder) => {
    // Registration
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
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
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Login successful!";
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
      state.token = action.payload.accessToken; // Make sure you get the correct property name
      state.user = action.payload.user || state.user; // Maintain user data if not provided
      state.isRefreshing = false;
    });
    builder.addCase(refreshUserToken.rejected, (state, action) => {
      state.isRefreshing = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
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
