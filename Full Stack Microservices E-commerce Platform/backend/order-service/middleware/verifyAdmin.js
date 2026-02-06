import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // token should include role and userId per your user-service token structure
    if (!decoded || !decoded.role) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    // only allow admin roles
    if (!["admin","superadmin","manager"].includes(decoded.role)) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.admin = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT verification error", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
