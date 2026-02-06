// models/order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Awaiting Payment", "Paid", "Failed"], default: "Awaiting Payment" },
    paymentDetails: {
      method: String,
      transactionId: String
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
