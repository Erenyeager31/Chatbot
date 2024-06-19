import { configureStore } from "@reduxjs/toolkit";
import { authAPI } from "./slices/authSlice";
import { chatAPI } from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [chatAPI.reducerPath]: chatAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware, chatAPI.middleware),
});

export default store;
