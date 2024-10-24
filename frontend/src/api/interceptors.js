import axios from "axios";
import localStorageService from "../utils/tokenUtils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorageService.getAccessToken();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the response status is 403, attempt to refresh the token
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorageService.getRefreshToken();
      console.log("Refresh Token:", refreshToken);
      if (!refreshToken) {
        console.error("No refresh token found");
        return Promise.reject(error);
      }

      try {
        const response = await axiosInstance.post("/auth/refresh", {
          refreshToken: refreshToken,
        });

        // Assuming the response contains new tokens
        localStorageService.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );

        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
