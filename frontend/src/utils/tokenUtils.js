export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (token) => {
  console.log("Setting access token:", token); // Check the token value
  localStorage.setItem("accessToken", token);
};
export const removeAccessToken = () => localStorage.removeItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setRefreshToken = (token) => {
  console.log("Setting refresh token:", token); // Check the token value
  localStorage.setItem("refreshToken", token);
};

export const removeRefreshToken = () => localStorage.removeItem("refreshToken");
