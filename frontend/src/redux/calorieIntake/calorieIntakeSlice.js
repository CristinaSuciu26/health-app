import { createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  searchProducts,
  getConsumedProducts,
  getDailyIntake,
  getProducts,
  removeProduct,
} from "./calorieIntakeOperations";

const initialState = {
  products: [],
  consumedProducts: [],
  dailyIntake: null,
  isLoading: false,
  error: null,
  selectedDate: new Date().toISOString().split("T")[0],
  productName: "",
  grams: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    setProductName(state, action) {
      state.productName = action.payload;
    },
    setGrams(state, action) {
      state.grams = action.payload;
    },
    clearProductForm(state) {
      state.productName = "";
      state.grams = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Daily Intake (for authenticated users)
      .addCase(getDailyIntake.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDailyIntake.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyIntake = action.payload.dailyIntake;
        state.products = action.payload.nonRecommendedProducts;
        state.error = null;
      })
      .addCase(getDailyIntake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consumedProducts.push(action.payload.consumedProduct);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove Product
      .addCase(removeProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consumedProducts = state.consumedProducts.filter(
          (product) => product._id !== action.payload._id
        );
        state.error = null;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get consumed products
      .addCase(getConsumedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConsumedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consumedProducts = action.payload;
        state.error = null;
      })
      .addCase(getConsumedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Products (for unauthenticated users)
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyIntake = action.payload.dailyIntake;
        state.products = action.payload.nonRecommendedProducts;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedDate, setProductName, setGrams, clearProductForm } =
  productSlice.actions;
export const productReducer = productSlice.reducer;
