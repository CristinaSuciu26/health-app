// import store from "../redux/store.js";
// import axiosInstance from "./apiConfig.js";
// import axios from "axios";
// import {
//   clearAuthHeader,
//   refreshToken,
// } from "../redux/auth/authOperations.js";

// // Request interceptor for attaching the token to headers
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for handling 401 errors and refreshing tokens
// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const { dispatch } = store;
//       try {
//         await dispatch(refreshToken()).unwrap();
//         const newToken = localStorage.getItem("accessToken");
//         axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         clearAuthHeader();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
