import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./appDbContext/connectDB.js";
import orderRoutes from "./routes/order.routes.js";
import { startOrderConsumer } from "./orderConsumer.js";
import cors from "cors";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5004;

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Order API
app.use("/api/orders", orderRoutes);

// KAFKA CONSUMER
startOrderConsumer();

app.listen(PORT, () => {
  connectDB();
  console.log(`Order service running on port ${PORT}`);
});
