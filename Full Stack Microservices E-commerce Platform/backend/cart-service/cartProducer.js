import { producer } from "../kafka/index.js";


export const publishCartEvent = async (event) => {
  await producer.connect();
  await producer.send({
    topic: "cart-item-events",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("Cart Item Event sent:", event);
};

export const publishCheckoutEvent = async (cart) => {
  await producer.connect();
  await producer.send({
    topic: "cart-checked-out",
    messages: [{ key: cart.userId, value: JSON.stringify(cart) }],
  });
  console.log("Cart checkout event published:", cart.userId);
};
