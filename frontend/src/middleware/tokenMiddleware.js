// import { logout, refreshUserToken } from "../redux/auth/authOperations";
// import {
//   getAccessToken,
//   removeAccessToken,
//   removeRefreshToken,
// } from "../utils/tokenUtils";

// const isTokenExpired = (token) => {
//   if (!token) return true; // If no token, it's considered expired
//   const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
//   const exp = payload.exp * 1000; // Convert to milliseconds
//   return Date.now() >= exp; // Check if current time is past expiration time
// };

// export const tokenMiddleware = (store) => (next) => (action) => {
//   const token = getAccessToken();

//   if (!token) {
//     // No token, log out and remove tokens
//     store.dispatch(logout());
//     removeAccessToken();
//     removeRefreshToken();
//     return; // Stop further processing
//   }

//   // Check if the token is expired
//   if (isTokenExpired(token)) {
//     // Token is expired; attempt to refresh or log out
//     store
//       .dispatch(refreshUserToken())
//       .then((response) => {
//         if (response.error) {
//           // If refresh fails, log out
//           store.dispatch(logout());
//           removeAccessToken();
//           removeRefreshToken();
//         }
//       })
//       .catch((err) => {
//         console.error("Error refreshing token:", err);
//         store.dispatch(logout());
//         removeAccessToken();
//         removeRefreshToken();
//       });
//     return; // Stop further processing while refreshing
//   }

//   // If the token is valid, pass the action along
//   return next(action);
// };
