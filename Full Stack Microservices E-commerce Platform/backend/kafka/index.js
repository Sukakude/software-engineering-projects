import { Kafka } from 'kafkajs';

// KAFKA INSTANCE
const kafka = new Kafka({
    clientId: "kafka-service",
    brokers:['localhost:9094'],
});

const admin = kafka.admin();

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [
            {topic: 'product-updated'},
            {topic: 'payment-successful'},
            {topic: 'email-successful'},
            {topic: 'cart-item-events'},
            {topic: 'cart-checked-out'},
            {topic: 'payment-failed'},
            {topic: 'order-created'},
            {topic: 'order-successful'},
            {topic: 'order-confirmed'},
            {topic: 'order-paid'},
            {topic: 'order-shipped'}
        ]
    });

}

run();


export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "ecommerce-group" });