import axios from "axios";
import localStorageService from "../utils/tokenUtils.js";
import { setTokens } from "../redux/auth/authSlice.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Function to refresh token
const refreshToken = async (dispatch) => {
  const refreshToken = localStorageService.getRefreshToken();
  console.log("Refresh Token:", refreshToken);

  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axiosInstance.post("/auth/refresh", {
    refreshToken: refreshToken,
  });

  // Update localStorage with new tokens
  localStorageService.setTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  });

  // Dispatch action to update Redux store
  dispatch(setTokens(response.data.accessToken));

  return response.data.accessToken;
};

// Function to set up interceptors and pass store's dispatch
export const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorageService.getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshToken(store.dispatch);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
