import { consumer } from "../kafka/index.js";
import { Order } from "./models/order.model.js";

export const startOrderConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Order Service connected to Kafka");

    // Subscribe to both payment topics
    await consumer.subscribe({ topic: "cart-checked-out", fromBeginning: false });
    await consumer.subscribe({ topic: "payment-successful", fromBeginning: false });
    await consumer.subscribe({ topic: "payment-failed", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log(`Received ${topic} event:`, event);
        
        if(topic === 'cart-checked-out'){
          await createOrder(event);
        }

        if (topic === "payment-successful") {
          await handlePaymentSuccess(event);
        }

        if (topic === "payment-failed") {
          await handlePaymentFailure(event);
        }
      },
    });
  } catch (error) {
    console.error("Kafka Consumer error in Order Service:", error);
  }
};

// --- Handlers ---
async function createOrder(event){
  try {
    // Create new order in Orders DB
      const newOrder = new Order({
        userId: event.userId,
        items: event.items,
        totalAmount: event.totalAmount,
        status: "Awaiting Payment",
        createdAt: new Date()
      });
      
      await newOrder.save();
      console.log(`Order created successfully for user ${event.userId} with Order Id: ${newOrder._id}`);
  } catch (error) {
    console.error("Error while trying to create an order:", error);
  }
}

async function handlePaymentSuccess(event) {
  try {
    const { orderId, userId, amount } = event;
    const order = await Order.findById(orderId);

    if (!order) {
      console.warn(`Order ${orderId} not found for payment success`);
      return;
    }

    order.status = "Paid"; // or “Paid”
    order.totalAmount = amount;
    await order.save();

    console.log(`Order ${orderId} marked as 'Paid'`);
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailure(event) {
  try {
    const { orderId } = event;
    const order = await Order.findById(orderId);

    if (!order) {
      console.warn(`Order ${orderId} not found for payment failure`);
      return;
    }

    order.status = "Pending"; // Payment failed, keep it pending
    await order.save();

    console.log(`Order ${orderId} payment failed`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

