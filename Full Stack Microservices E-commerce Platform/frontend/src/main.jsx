import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/router.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import 'sweetalert2'

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} /> {/* <-- needed for createBrowserRouter */}
    </Provider>
  </React.StrictMode>
);


// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <RouterProvider router={router} />
//   </Provider>,
// )
