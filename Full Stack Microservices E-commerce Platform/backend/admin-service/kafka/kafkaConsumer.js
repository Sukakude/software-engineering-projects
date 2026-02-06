import { consumer } from "../../kafka/index.js";

export const startKafkaConsumers = async () => {
  try {
    // subscribe to any topics you want admin to react to
    await consumer.subscribe({ topic: "order-created", fromBeginning: false });
    await consumer.subscribe({ topic: "product-updated", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        console.log(`[admin consumer] topic=${topic} payload=`, payload);
        // optionally store audit logs or update a reporting cache
      }
    });

    console.log("Admin Kafka consumer started");
  } catch (err) {
    console.error("startKafkaConsumers error:", err);
  }
};
