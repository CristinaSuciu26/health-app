import { authReducer } from "./auth/authSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./calorieIntake/calorieIntakeSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

export default store;
