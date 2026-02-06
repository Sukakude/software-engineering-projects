import { createBrowserRouter } from "react-router";
import App from "../App"
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import Book from "../pages/books/Book";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import ProfilePage from "../components/ProfileUpdate";
import ProtectedRoute from "./ProtectedRoutes.jsx";
import AdminRoute from "./AdminRoute.jsx"
import StripeProvider from "../pages/books/StripeProvider.jsx";
import CheckoutForm from "../pages/books/CheckoutPage";
import DashboardLayout from "../pages/dashboard/dashboardLayout.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import ManageBooks from "../pages/dashboard/Manage Books/ManageBooks.jsx";
import AddBook from "../pages/dashboard/Add Book/AddBook.jsx";
import UpdateBook from "../pages/dashboard/Edit Book/UpdateBook.jsx"
import VerifyEmail from "../components/VerifyEmail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        // HOME router
        path:"/",
        element: <Home/>
      },
      {
        // ORDERS
        path: "/orders",
        element: (
          <ProtectedRoute>
            <div>Orders</div>
          </ProtectedRoute>
        ),
      },
      {
        // ABOUT 
        path:"/verify",
        element: <VerifyEmail/>
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword/>
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword/>
      },
      {
        path: '/update-profile',
        element: (
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        ),
      },
      {
        path:"/login",
        element: <Login/>
      },
      {
        path:"/register",
        element: <Register/>
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/checkout",
        element: (
          <StripeProvider>
            <CheckoutForm />
          </StripeProvider>
        )
      },
      {
        path: '/books/:id',
        element: <Book/>
      }
    ]
  },
  {
    path: '/admin',
    element: <Login/>
  },
  {
    path: "/dashboard",
    element: <AdminRoute> <DashboardLayout/> </AdminRoute>,
    children: [
      {
        path: "",
        element: <AdminRoute> <Dashboard/> </AdminRoute>
      },
      {
        path: "manage-books",
        element: <AdminRoute> <ManageBooks/> </AdminRoute>
      },
      {
        path: "add-new-book",
        element: <AdminRoute> <AddBook/> </AdminRoute>
      },
      {
        path: "edit-book/:id",
        element: <AdminRoute> <UpdateBook/> </AdminRoute>
      },
    ]
  }
]);

export default router;