import express from "express";
import {
  initiatePayment,
  stripeWebhook,
  refundPayment,
  getPaymentHistory
} from "../controllers/payment.controller.js";

const router = express.Router();

// Payment initiation
router.post("/initiate", initiatePayment);

// Stripe Webhook (must use raw body parser)
// router.post("/webhook",stripeWebhook);

// Refund
router.post("/refund", refundPayment);

// History
router.get("/history/:userId", getPaymentHistory);

export default router;
