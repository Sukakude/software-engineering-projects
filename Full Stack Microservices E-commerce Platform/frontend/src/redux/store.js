import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/features/cart/cartSlice.js";
import bookApi from "./features/books/booksApi";
import bookCategoriesApi from "./features/books/bookCategoriesApi.js";
import usersApi from "./features/users/usersApi.js";
import ordersApi from "./features/orders/ordersApi.js"
import authReducer from "../redux/features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [bookCategoriesApi.reducerPath]: bookCategoriesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookApi.middleware,
      bookCategoriesApi.middleware,
      usersApi.middleware,
      ordersApi.middleware
    ),
});

export default store;
