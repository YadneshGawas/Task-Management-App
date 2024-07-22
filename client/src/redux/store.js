import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authS";
import { apiSlice } from "./slice/apiS";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
