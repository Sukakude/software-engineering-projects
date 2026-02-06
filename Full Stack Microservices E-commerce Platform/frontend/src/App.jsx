import React from "react";
import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import {store} from "./redux/store.js"; 

function App() {
  return (
    <Provider store={store}>
      <Navbar />

      <main className="min-h-screen max-w-6xl mx-auto px-4 py-6 font-primary">
        <Outlet />
      </main>

      <Footer />
    </Provider>
  );
}

export default App;
