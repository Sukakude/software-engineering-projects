import React, { useState } from "react";
import { Link } from "react-router"; 
import { FaBook } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import avatarImg from "../assets/avatar.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const auth = useSelector((state) => state.auth); // ✅ get auth state from Redux
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Profile", href: "/profile" },
    { name: "My Orders", href: "/orders" },
  ];

  return (
    <header className="max-w-6xl mx-auto px-4 py-6 text-[#5300E4]">
      <nav className="flex justify-between items-center">
        {/* LEFTSIDE NAV ITEMS */}
        <div className="flex items-center md:gap-16 gap-4">
          {/* LOGO */}
          <Link to="/" className="inline-flex items-center gap-1.5">
            <FaBook />
            StarBooks
          </Link>

          {/* SEARCH BAR  */}
          <div className="relative sm:w-72 w-40 space-x-2 text-[#FFFFFF]">
            <IoSearchOutline className="absolute inline-block left-1.5 inset-y-2" />
            <input
              type="text"
              placeholder="Find book here"
              className="bg-[#5400e4e0] w-full py-1 md:px-8 px-6 rounded-3xl focus:outline-none"
            />
          </div>
        </div>

        {/* RIGHTSIDE NAV ITEMS */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          {/* USER ICON */}
          <div>
            {auth.isAuthenticated && auth.user ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarImg}
                    alt="User Image"
                    className={`size-7 rounded-full ${
                      auth.user ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN MENU */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-[#5300E4] hover:text-white"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li className="block px-4 py-2 text-sm hover:bg-[#5300E4] hover:text-white">
                        <button
                          onClick={handleLogout}
                          className="text-red-500 cursor-pointer w-full text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>

          {/* WISHLIST ICON */}
          <button className="hidden sm:block cursor-pointer">
            <HiOutlineHeart className="size-6" />
          </button>

          {/* SHOPPING CART ICON */}
          {auth.isAuthenticated && auth.user && (
            <Link
              to="/cart"
              className="bg-[#5300E4] text-[#FFFFFF] p-1 sm:px-6 px-2 flex items-center rounded-sm"
            >
              <HiOutlineShoppingCart />
              {cartItems.length > 0 ? (
                <span className="text-sm font-semibold sm:ml-1">
                  {cartItems.length}
                </span>
              ) : (
                <span className="text-sm font-semibold sm:ml-1">0</span>
              )}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
