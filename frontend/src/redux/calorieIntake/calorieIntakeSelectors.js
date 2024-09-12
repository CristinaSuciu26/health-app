export const selectProducts = (state) => state.products.products;
export const selectConsumedProducts = (state) =>
  state.products.consumedProducts;
export const selectDailyIntake = (state) => state.products.dailyIntake;
export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;
export const selectProductName = (state) => state.products.productName;
export const selectGrams = (state) => state.products.grams;
export const selectSelectedDate = (state) => state.products.selectedDate;
