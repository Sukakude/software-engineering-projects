import Payment from "../models/payment.model.js";
import { sendKafkaEvent } from "../kafka/kafkaProducer.js";
import {stripe} from "../config/stripe.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, userId, amount } = req.body;

    // Create Payment Intent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: "usd",
      metadata: { orderId: String(orderId), userId: String(userId) },
      expand: ["charges.data.balance_transaction"],
      automatic_payment_methods:{enabled:true, allow_redirects: 'never'}
    });

    // Save in DB
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      method: "Stripe",
      status: "Pending",
      transactionId: paymentIntent.id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// WEBHOOK
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  console.log("Received Stripe webhook request"); // debug log

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Webhook signature verified");
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Event type:", event.type);

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    console.log(`Charge ${charge.id} was refunded`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log(paymentIntent);

    const receiptUrl =
      paymentIntent.charges?.data?.[0]?.receipt_url || null;

    await Payment.findOneAndUpdate(
      { transactionId: paymentIntent.id },
      { status: "Success", receiptUrl }
    );

    // Publish event to Kafka
    await sendKafkaEvent("payment-successful", {
      orderId: paymentIntent.metadata?.orderId,
      userId: paymentIntent.metadata?.userId,
      amount: paymentIntent.amount / 100
    });

    // Notify Order Service that payment succeeded
    try {
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/internal/update-status/${paymentIntent.metadata?.orderId}`,
        {
          status: "Paid",
          transactionId: paymentIntent.id
        },
        {
          headers: { "x-internal-key": process.env.INTERNAL_API_KEY }
        }
      );
      console.log("Order service notified of payment success");
    } catch (err) {
      console.error("Failed to notify order service:", err.message);
    }

    console.log("Payment succeeded for order:", paymentIntent.metadata?.orderId);
  }


  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    console.log("Payment failed for order:", paymentIntent.metadata.orderId);

    await Payment.findOneAndUpdate(
      { transactionId: paymentIntent.id },
      { status: "Failed" }
    );

    await sendKafkaEvent("payment-failed", {
      orderId: paymentIntent.metadata.orderId,
      userId: paymentIntent.metadata.userId
    });
  }

  res.json({ received: true });
};

// Refund
export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId
    });

    payment.status = "Refunded";
    await payment.save();

    res.json({ message: "Refund successful", refund });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ message: "Refund failed" });
  }
};

// History
export const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
