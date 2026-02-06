import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String },
  email: { type: String },
  role: { type: String, enum: ["superadmin","manager","viewer"], default: "manager" },
  // Do NOT store user passwords here if user-service handles auth. This model is for admin metadata.
  createdAt: { type: Date, default: Date.now }
});

export const Admin = mongoose.model("Admin", AdminSchema);
