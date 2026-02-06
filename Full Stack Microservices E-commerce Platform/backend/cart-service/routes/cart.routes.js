import express from "express";
import {
  addToCart,
  removeFromCart,
  updateItemQuantity,
  getUserCart,
  clearCart,
  checkoutCart
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require logged-in user
router.use(verifyToken);

router.post("/add", addToCart);
router.post("/checkout", checkoutCart);
router.post("/remove", removeFromCart);
router.post("/update", updateItemQuantity);
router.post("/clear/:userId", clearCart);
router.get("/:userId", getUserCart);

export default router;
