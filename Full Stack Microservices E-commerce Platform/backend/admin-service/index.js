import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/admin.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { startKafkaConsumers } from "./kafka/kafkaConsumer.js";
import { connectDB } from "./appDbContext/connectDB.js";
import { verifyAdmin } from "./middleware/verifyAdmin.js";
import cors from "cors"

dotenv.config();
const app = express();

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/admin", verifyAdmin, adminRoutes);
app.use("/api/admin/reports", verifyAdmin, reportRoutes);
app.get("/health", (req, res) => res.json({ ok: true, service: "admin-service" }));


app.listen(process.env.PORT || 5007, () => {
  startKafkaConsumers();
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 5007}`);
});