import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './AppDbContext/connectDB.js';
import productRoutes from '../product-service/routes/product.route.js'
import categoryRoutes from '../product-service/routes/category.route.js'

// import authRoutes from './routes/auth.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use(express.json()); // <-- parses application/json
app.use(express.urlencoded({ extended: true })); // <-- parses application/x-www-form-urlencoded
app.use(cookieParser()); // <-- parses cookies


// create the authentication API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
