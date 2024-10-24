const localStorageService = (() => {
  const getAccessToken = () => localStorage.getItem("accessToken");

  const getRefreshToken = () => localStorage.getItem("refreshToken");

  const setTokens = ({ accessToken, refreshToken }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
  };
})();

export default localStorageService;
