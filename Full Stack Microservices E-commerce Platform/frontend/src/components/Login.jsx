import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../redux/features/users/usersApi"; 
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";

const Login = () => {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      // Save user + token to Redux and localStorage
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate("/"); // redirect after login
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(error?.data?.message || "Incorrect email or password.");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4 text-[#5300E4] text-center">
          Please Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-[#5300E4] text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow text-[#5300E4]"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">
                Email is required
              </p>
            )}
          </div>

          <div className="mb-7">
            <label
              className="block text-[#5300E4] text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow text-[#5300E4]"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                Password is required
              </p>
            )}
          </div>

          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          <div>
            <button
              type="submit"
              className="bg-[#5300E4] text-white py-2 px-6 rounded-3xl w-full hover:text-blue-300 focus:outline-none font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="align-baseline font-medium mt-4 text-sm">
          Forgot Password?{" "}
          <Link
            to="/forgot-password"
            className="text-red-500 font-semibold hover:text-blue-500"
          >
            Reset
          </Link>
        </p>
        <p className="align-baseline font-medium mt-4 text-sm">
          Don't have an account? Register{" "}
          <Link
            to="/register"
            className="text-[#5300E4] font-semibold hover:text-blue-500"
          >
            here
          </Link>
        </p>
        <p className="mt-5 text-center text-gray-500 text-xs">
          &copy; 2025 Starbooks. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
