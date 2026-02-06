import { createContext, useContext, useEffect, useState } from "react";
import { useLoginMutation, useLogoutMutation, useCheckAuthQuery, useSignupMutation, useResetPasswordMutation, useVerifyEmailMutation, useForgotPasswordMutation } from "../redux/features/users/usersApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const [loginApi] = useLoginMutation();
  const [logoutApi] = useLogoutMutation();
  const [signupApi] = useSignupMutation();


  // Check if user is logged in on app start
  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(userData);
    }
  }, [token]);

  // REGISTER
  const registerUser = async (email, password) => {
    const response = await signupApi({ email, password }).unwrap();

    if (response.success) {
      // Automatically log the user in after registration if you want
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setToken(response.token);
      setCurrentUser(response.user);
    }

    return response;
  };

  // LOGIN
  const login = async (email, password) => {
    const response = await loginApi({ email, password }).unwrap();

    console.log("Login API Response:", response)

    if (response.success) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setToken(response.token);
      setCurrentUser(response.user);
    }
    return response;
  };

  // LOGOUT
  const logout = async () => {
    await logoutApi().unwrap().catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    registerUser,
    token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
