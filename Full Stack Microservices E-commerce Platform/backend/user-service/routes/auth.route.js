import express from "express";
import {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, updateProfile, users, resendVerificationCode} from "../controllers/auth.controllers.js"
import { verify } from "crypto";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import multer from "multer";

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, users);

// signup route
router.post('/signup', signup);

// verify email endpoint
router.post('/verify-email', verifyEmail);

// forgot password endpoint
router.post('/forgot-password', forgotPassword);

// reset password endpoint
router.post('/reset-password/:token', verifyToken, resetPassword);

// resend code enpoint
router.post("/resend-verification", resendVerificationCode);

// login route
router.post('/login', login);

// Multer setup
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function(req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

// Protected route to update profile with file upload
router.put("/update-profile", verifyToken, upload.single("photo"), updateProfile);

// check authentication (to check whether user is authenticated)
router.get('/check-auth', verifyToken, checkAuth) // we will use Middleware called verifyToken for this task

// logout route
router.post('/logout', logout);

export default router;
