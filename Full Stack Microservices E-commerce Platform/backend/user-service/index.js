import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from './appDbContext/connectDB.js';
import authRoutes from './routes/auth.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json()); // parses incoming requests
app.use(cookieParser()); // parse incoming cookies

// create the authentication API
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

// database username: 2020210304_db_user
// database password: 4RUgPD3EQfWhfal4