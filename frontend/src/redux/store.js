import { authReducer } from "./auth/authSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./calorieIntake/calorieIntakeSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

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
    }), // Add your middleware here
});
store.subscribe(() => {
  const state = store.getState();
  console.log("State after rehydration:", state);
});
export const persistor = persistStore(store);

export default store;
