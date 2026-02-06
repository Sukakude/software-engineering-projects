import express from "express";
import dotenv from "dotenv";
import { startNotificationConsumer } from "./kafka/notificationConsumer.js";

dotenv.config();
const app = express();
app.use(express.json());

app.listen(process.env.PORT || 5006, () => {
  console.log("Notifications Service running");
  startNotificationConsumer(); 
});
