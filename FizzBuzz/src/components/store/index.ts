import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./inputSlice";

// Create Redux store
export const store = configureStore({
  reducer: {
    input: inputReducer, // Add the input reducer to the store
  },
});

// Type for RootState and Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
