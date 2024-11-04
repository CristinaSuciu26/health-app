import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./auth/authSlice.js";
import { productReducer } from "./products/productsSlice.js";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isLoggedIn", "isLoading"],
};

const authPersistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: authPersistedAuthReducer,
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

// store.subscribe(() => {
//   const state = store.getState();

//   console.log("State after rehydration:", state);
// });

export const persistor = persistStore(store);

export default store;
