import { consumer } from "../../kafka/index.js";
import { sendEmail, sendSMS } from "../controllers/notification.controller.js";

export const startNotificationConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-confirmed", fromBeginning: false });
  await consumer.subscribe({ topic: "order-shipped", fromBeginning: false });
  await consumer.subscribe({ topic: "order-created", fromBeginning: false });

  console.log("Notifications Service consumer connected and subscribed.");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      const { userId, orderId, amount } = data;

      try {
        switch (topic) {
          case "order-created":
            await sendEmail(data.email, "Order Confirmation", `Your order #${data.orderId} has been received.`);
            break;
          case "order-shipped":
            await sendSMS(data.phone, `Your order #${data.orderId} has been shipped.`);
            break;
          case "payment-successful":
            await sendEmail(data.email, "Payment Successful", `Payment received for order #${data.orderId}.`);
            break;
          default:
            console.log("Unknown topic:", topic);
        }
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    },
  });
};
