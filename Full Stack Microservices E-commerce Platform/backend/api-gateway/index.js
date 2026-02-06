// API GATEWAY
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

const app = express();

// app.use(express.json());
app.use(cookieParser());

// USER-SERVICE ROUTES
app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/api/users": "/api" }, // forwards to /api in user-service
    logLevel: "debug"
  })
);

// PRODUCT-SERVICE ROUTES (secured with verifyToken)
app.use(
  "/api/products",
  verifyToken, // optional: only allow authenticated users
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
    pathRewrite: { "^/api/products": "/api" }, // forwards to /api in product-service
  })
);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running at http://localhost:${process.env.PORT}`);
});
