import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../utils/tokenUtils.js";
import {
  login,
  logout,
  register,
  refreshCurrentUser,
} from "./authOperations.js";
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
    // Helper function for setting loading state
    const setLoadingState = (state, isLoading) => {
      state.isLoading = isLoading;
      state.error = null;
    };

    const handleTokenUpdates = (state, { accessToken, refreshToken }) => {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    };

    // Registration
    builder.addCase(register.pending, (state) => {
      setLoadingState(state, true);
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      handleTokenUpdates(state, action.payload);
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Registration successful!";
    });
    builder.addCase(register.rejected, (state, action) => {
      setLoadingState(state, false);
      state.error = action.payload || "Registration failed";
    });

    // Login
    builder.addCase(login.pending, (state) => {
      setLoadingState(state, true);
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      handleTokenUpdates(state, action.payload);
      state.isLoggedIn = true;
      state.isLoading = false;
      state.success = "Login successful!";
      refreshCurrentUser();
    });
    builder.addCase(login.rejected, (state, action) => {
      setLoadingState(state, false);
      state.error = action.payload || "Login failed. Please try again.";
    });

    // Current User Refresh
    builder.addCase(refreshCurrentUser.pending, (state) => {
      state.isRefreshing = true;
    });
    builder.addCase(refreshCurrentUser.fulfilled, (state, action) => {
      console.log("Current User Refresh Action Payload:", action.payload);

      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isRefreshing = false;
    });
    builder.addCase(refreshCurrentUser.rejected, (state) => {
      state.isRefreshing = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      setLoadingState(state, true);
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = { name: null, email: null };
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
    });
  },
});

export const authReducer = authSlice.reducer;
