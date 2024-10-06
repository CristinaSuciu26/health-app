import store from "../redux/store";
import { refreshUserToken } from "../redux/auth/authSlice";
import axiosInstance from "./apiConfig";

// Request Interceptor: Attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    console.log("Request made with headers: ", config.headers);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Response error: ", error.response);

    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const resultAction = await store.dispatch(refreshUserToken());
        const newAccessToken = resultAction.payload.accessToken;
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Response error: ", error.response);

        store.dispatch({ type: "auth/logout" });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
