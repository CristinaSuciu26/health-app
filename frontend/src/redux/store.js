import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./auth/authSlice.js";
import { productReducer } from "./calorieIntake/calorieIntakeSlice.js";
import { setupAxiosInterceptors } from "../api/interceptors.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "isLoggedIn", "isLoading"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register"],
      },
    }),
});


setupAxiosInterceptors(store);

store.subscribe(() => {
  const state = store.getState();
  console.log("State after rehydration:", state);
});

export const persistor = persistStore(store);

export default store;
