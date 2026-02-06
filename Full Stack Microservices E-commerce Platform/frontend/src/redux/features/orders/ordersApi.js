import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ORDERS_SERVICE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // GET all orders
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),

    // GET a single order by id
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),

    // POST a new order
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/orders/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),

    // Optionally: DELETE an order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

    // Optionally: UPDATE order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export default ordersApi;

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
