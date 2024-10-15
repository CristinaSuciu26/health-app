export const selectUser = (state) => state.auth.user;
export const selectrefreshToken = (state) => state.auth.refreshToken;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectSuccess = (state) => state.auth.success;
export const selectIsRefreshing = (state) => state.auth.isRefreshing;
