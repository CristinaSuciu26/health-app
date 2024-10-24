import { createSlice } from "@reduxjs/toolkit";
import { register, login, logout } from "./authOperations.js";

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
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    // Helper function for setting loading state
    const setLoadingState = (state, isLoading) => {
      state.isLoading = isLoading;
      state.error = null;
    };

    const handleTokenUpdates = (state, { accessToken, refreshToken }) => {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
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
    });
    builder.addCase(login.rejected, (state, action) => {
      setLoadingState(state, false);
      state.error = action.payload || "Login failed. Please try again.";
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
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload || "Logout failed";
      state.isLoading = false;
    });
  },
});
export const { setTokens } = authSlice.actions;
export const authReducer = authSlice.reducer;
