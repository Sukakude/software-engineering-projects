import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "product-service", brokers: ["localhost:9094"] });
const producer = kafka.producer();

export const sendProductEvent = async (product) => {
  await producer.connect();
  await producer.send({
    topic: "products",
    messages: [
      { key: product._id.toString(), value: JSON.stringify(product) }
    ]
  });
};
