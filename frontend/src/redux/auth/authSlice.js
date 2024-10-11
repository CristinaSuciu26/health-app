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
  refreshUserToken,
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
      state.error = action.payload || "Registration failed";
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
      state.error = action.payload || "Login failed. Please try again.";
    });

    // Current User Refresh
    builder.addCase(refreshCurrentUser.pending, (state) => {
      state.isRefreshing = true;
    });

    builder.addCase(refreshCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isRefreshing = false;
    });
    builder.addCase(refreshCurrentUser.rejected, (state) => {
      state.isRefreshing = false;
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
      // removeAccessToken();
      // removeRefreshToken();
    });
  },
});
export const authReducer = authSlice.reducer;
