// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./appDbContext/connectDB.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(cookieParser());

// Cart API
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Cart service running on port ${PORT}`);
});
