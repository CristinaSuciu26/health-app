// import axios from "axios";
// import {
//   selectAccessToken,
//   selectrefreshToken,
// } from "../redux/auth/authSelectors";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000/api",
// });

// // Request interceptor to add Authorization header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = selectAccessToken;
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle token expiration and refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = selectrefreshToken;
//         if (!refreshToken) {
//           throw new Error("Refresh token missing, logging out");
//         }

//         const { data } = await axios.post("/api/auth/refresh", {
//           token: refreshToken,
//         });
//         if (!refreshToken) {
//           window.location.href = "/login";
//         }

//         selectAccessToken(data.accessToken);
//         selectrefreshToken(data.refreshToken);

//         originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Token refresh failed", refreshError);

//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
