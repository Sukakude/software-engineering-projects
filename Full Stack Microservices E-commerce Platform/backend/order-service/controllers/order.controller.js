// controllers/order.controller.js
import { Order } from "../models/order.model.js";
import { sendKafkaEvent } from "../kafka/kafkaProducer.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, totalAmount, paymentMethod, transactionId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount: totalAmount,
      status: "Awaiting Payment", 
      paymentDetails: {
        method: paymentMethod || "Unspecified",
        transactionId: transactionId || "",
      },
    });

    await sendKafkaEvent("order-created", {
      orderId: newOrder._id,
      email: req.body.email
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; 
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (internal use)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentId, transactionId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status || order.status;
    if (paymentId) order.paymentId = paymentId;
    if (transactionId) order.transactionId = transactionId;

    await order.save();

    console.log(`Order ${orderId} updated to status: ${order.status}`);

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

export const markOrderAsPaid = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = "Paid";
    await order.save();

    // Publish Kafka event
    await sendKafkaEvent("order-confirmed", {
      orderId: order._id.toString(),
      userId: order.userId.toString(),
      amount: order.totalAmount
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error marking order as paid:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ADMIN FUNCTIONALITY: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } 

    else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } 

    else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};