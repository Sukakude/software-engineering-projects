import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { listUsers, deleteUser, listProductsProxy, deleteProductProxy, listOrdersProxy, getDashboardOverview } from "../controllers/admin.controller.js";

const router = express.Router();

// Dashboard overview
router.get("/dashboard", verifyAdmin, getDashboardOverview);

// Admin-protected endpoints
router.get("/users", verifyAdmin, listUsers);
router.delete("/users/:id", verifyAdmin, deleteUser);

// Proxy product management (admin)
router.get("/products", verifyAdmin, listProductsProxy);
router.delete("/products/:id", verifyAdmin, deleteProductProxy);

// Proxy orders
router.get("/orders", verifyAdmin, listOrdersProxy);

export default router;
