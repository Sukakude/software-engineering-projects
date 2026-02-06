import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  // Check cookie (optional) or Authorization header
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user - no token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
