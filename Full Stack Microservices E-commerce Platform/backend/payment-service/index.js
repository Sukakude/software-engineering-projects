import express from "express";
import mongoose from "mongoose";
import paymentRoutes from "./routes/payment.routes.js";
import dotenv from "dotenv";
import { stripeWebhook } from "./controllers/payment.controller.js";
import cors from 'cors';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5005;

// Stripe Webhook uses raw body — must be before express.json()
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Normal JSON parser
app.use(express.json());

app.use("/api/payments", paymentRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("PaymentsDB connected successfully!");
    app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
  })
  .catch(err => console.error(err));
