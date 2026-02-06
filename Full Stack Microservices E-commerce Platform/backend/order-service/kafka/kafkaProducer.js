import { producer } from "../../kafka/index.js";

export const sendKafkaEvent = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
};
