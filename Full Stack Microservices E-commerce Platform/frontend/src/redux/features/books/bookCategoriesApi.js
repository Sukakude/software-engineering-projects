import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { productsURL } from '../../../utils/baseURL.js';

const baseQuery = fetchBaseQuery({
    baseUrl: `${productsURL()}/api/categories`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux auth slice
      const token = getState().auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
});

const bookCategoriesApi = createApi({
    reducerPath: 'bookCategoriesApi',
    baseQuery,
    tagTypes: ['Product-Categories'],
    endpoints: (builder) => ({
        fetchAllProductCategories: builder.query({
            query: () => "/",
            providesTags: ['Product-Categories']
        })
    }),
});

export const { useFetchAllProductCategoriesQuery } = bookCategoriesApi;
export default bookCategoriesApi;