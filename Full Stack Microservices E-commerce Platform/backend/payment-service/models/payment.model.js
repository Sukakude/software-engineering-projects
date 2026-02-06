import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["Stripe", "PayPal"], required: true },
    status: { type: String, enum: ["Pending", "Success", "Failed", "Refunded"], default: "Pending" },
    transactionId: { type: String },
    receiptUrl: { type: String } // Stripe provides this automatically
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
