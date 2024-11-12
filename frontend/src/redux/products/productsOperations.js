import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors.js";

export const getProducts = createAsyncThunk(
  "calories/getProducts",
  async (intakeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/foods/intake", {
        params: intakeData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching products."
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "calories/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/foods/add", product);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding product."
      );
    }
  }
);

export const getDailyIntake = createAsyncThunk(
  "calories/getDailyIntake",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/foods/daily-intake", body);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching daily intake."
      );
    }
  }
);

export const getConsumedProducts = createAsyncThunk(
  "calories/getConsumedProducts",
  async (selectedDate, { rejectWithValue }) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const dateToFetch = selectedDate || currentDate;

      const response = await axiosInstance.get("/foods/consumed-products", {
        params: { date: dateToFetch },
      });

      const { consumedProducts } = response.data;

      if (!consumedProducts || consumedProducts.length === 0) {
        return rejectWithValue("No products found for the specified date.");
      }

      return consumedProducts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching consumed products."
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "calories/searchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/foods/search", {
        params: { query },
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error searching products."
      );
    }
  }
);

export const removeProduct = createAsyncThunk(
  "calories/removeProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/foods/delete", {
        data: { id: productId },
      });
      return { _id: productId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error removing product."
      );
    }
  }
);
