import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API setup
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_USERS_SERVICE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Signup
    signup: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),

    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/reset-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),

    // Verify Email
    verifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/verify-email",
        method: "POST",
        body: payload,
      }),
    }),

    // Check Authentication
    checkAuth: builder.query({
      query: () => "/check-auth",
      providesTags: ["User"],
    }),

    // Update Profile
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/update-profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Resend code
    resendVerification: builder.mutation({
      query: (payload) => ({
        url: "/resend-verification",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export default usersApi;
export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useCheckAuthQuery,
  useUpdateProfileMutation,
  useResendVerificationMutation
} = usersApi;
