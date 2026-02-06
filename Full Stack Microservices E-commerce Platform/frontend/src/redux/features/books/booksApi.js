import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { productsURL } from '../../../utils/baseURL.js';

const baseQuery = fetchBaseQuery({
    baseUrl: `${productsURL()}/api/products`,
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

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        fetchAllProducts: builder.query({
            query: () => "/",
            providesTags: ['Products']
        }),
        fetchBookById: builder.query({
          query: (id) => `/${id}`,
          providesTags: (results, error, id) =>  [{type: "Products", id}]
        }),
        addBook: builder.mutation({
          query: (newBook) => ({
            url: `/add`,
            method: 'POST',
            body: newBook
          }),
          invalidatesTags: ["Products"]
        }),
        updateBook: builder.mutation({
          query: ({id, ...rest}) => ({
            url: `/edit?id=${id}`,
            method: "PUT",
            body: rest,
            headers: {
              'Content-Type': 'application/json'
            }
          }),
          invalidatesTags: ['Products']
        }),
        deleteBook: builder.mutation({
          query: (id) => ({
            url: `/delete?id=${id}`,
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json'
            }
          }),
          invalidatesTags: ['Products']
        })
    }),
});

export const { useFetchAllProductsQuery, useFetchBookByIdQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation } = booksApi;
export default booksApi;