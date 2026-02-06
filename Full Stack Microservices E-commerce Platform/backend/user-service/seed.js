import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";

dotenv.config();

const users = [
  { email: "john@example.com", password: "password123", role: "user", name: "John Doe" },
  { email: "jane@example.com", password: "password123", role: "user", name: "Jane Smith" },
  { email: "2020210304@ufs4life.ac.za", password: "admin123", role: "admin", name: "Admin" }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected...");

    // Optional: delete existing users
    await User.deleteMany();

    // Loop through users
    for (const u of users) {
      // Hash password
      const hashedPassword = await bcrypt.hash(u.password, 10);

      const newUser = new User({
        email: u.email,
        password: hashedPassword,
        role: u.role,
        name: u.name
      });

      await newUser.save();
      console.log(`Seeded user: ${u.email} (${u.role})`);
    }

    console.log("Users seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
