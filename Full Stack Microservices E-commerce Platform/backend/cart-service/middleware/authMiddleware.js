// export const isAdmin = (req, res, next) => {
//   console.log(req.user);
//   if (req.user && req.user.role === 'admin') {
//     return next();
//   }
//   return res.status(403).json({ 
//         success:false,
//         message: 'Admin access required'
//     });
// };

// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) {
//     return res.status(401).json({ success: false, message: "No token provided" });
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;  // now you can use req.userId in your endpoints
//     req.role = decoded.role;      // optional: if your token has role info
//     next();
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(403).json({ success: false, message: "Invalid token" });
//   }
// };

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// Optional: admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
