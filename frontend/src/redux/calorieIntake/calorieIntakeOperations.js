import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000/api/foods";

export const getProducts = createAsyncThunk(
  "calories/getProducts",
  async (intakeData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/intake`, {
        params: intakeData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const addProduct = createAsyncThunk(
  "calories/addProduct",
  async (product, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.post(`${API_URL}/add`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error response:", error.response);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const getDailyIntake = createAsyncThunk(
  "calories/getDailyIntake",
  async (body, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const response = await axios.post(`${API_URL}/daily-intake`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);
export const getConsumedProducts = createAsyncThunk(
  "calories/getConsumedProducts",
  async (selectedDate, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const dateToFetch = selectedDate || currentDate;

      const response = await axios.get(`${API_URL}/consumed-products`, {
        params: {
          date: dateToFetch,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { consumedProducts } = response.data;

      if (!consumedProducts || consumedProducts.length === 0) {
        throw new Error("No products found for the specified date.");
      }

      return consumedProducts;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "calories/searchProducts",
  async (query, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get(`${API_URL}/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while searching products"
      );
    }
  }
);
export const removeProduct = createAsyncThunk(
  "calories/removeProduct",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.delete(`${API_URL}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: productId },
      });

      return { _id: productId };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);
