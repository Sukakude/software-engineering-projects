// routes/order.routes.js
import express from "express";
import { authMiddleware, requireAdmin } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { internalAuth } from "../middleware/internalAuth.js";
import { getUserOrders, getOrderById, updateOrderStatus, markOrderAsPaid, createOrder, getAllOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/paid", internalAuth, markOrderAsPaid);

// Admin endpoints
router.put("/internal/update-status/:orderId", internalAuth, updateOrderStatus);
router.get('/', verifyAdmin, authMiddleware, getAllOrders);

export default router;
