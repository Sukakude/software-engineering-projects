import bcryptjs from "bcryptjs";
import crypto from 'crypto'; 

import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken";

import {generateVerificationToken} from "../utils/generateVerificationToken.js"
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js"
import {sendResetSuccessEmail, sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

const ADMIN_EMAIL = "2020210304@ufs4life.ac.za"

export const users = async (req, res) => {
    return res.status(201).json({
        success: true,
        data: await User.find()
    })
}

// signup controller
export const signup = async (req, res) => {
    // res.send('Signup route'); // used for testing
    const {email, password} = req.body;
    let role = ""
    
    // Error handling
    try{
        // check if all fields have data
        if(!email || !password){
            // throw an error
            throw new Error("All fields are required");
        }

        if(email === ADMIN_EMAIL){
            role = 'admin'
        }

        // Search for a user in the database
        const userExists = await User.findOne({email});

        // if user exists throws an error
        if(userExists){
            return res.status(400).json({success:false, message: "User Already Exists."});
        }
        
        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            email, 
            password: hashedPassword,
            role: role || 'user', // fallback only if not provided
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // expires in 24hours
        });

        await user.save();

        // send token to client - JWT authentication
        generateTokenAndSetCookie(res, user._id);

        // Sends the verification token to a client
        await sendVerificationEmail(user.email, verificationToken);

        // return a success message
        res.status(201).json({
            success:true, 
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } 
    catch(error){
        res.status(400).json({success:false, message: error.message});
    }
};

// verify email controller
export const verifyEmail = async (req, res) => {
    const {verificationCode} = req.body;
    try{
        // search for user using verification code and check if the code has not expired
        const user = await User.findOne({
            verificationToken: verificationCode, // match the verification code
            verificationTokenExpiresAt: {$gt: Date.now()} // check if the token has not expired 
        });

        // check if user is not null
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Invalid or expired verification code"
            });
        }

        // verify user
        user.isVerified = true;

        // update the verification details
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        
        // save the user
        await user.save();

        // send a welcome message to user
        await sendWelcomeEmail(user.email, user.name);

        // return a success response
        res.status(200).json({
            success:true,
            message: "Email successfully verified",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    }
    catch(error){
        console.log(`Error in verify email`, error);
        res.status(500).json({success:false, message: "Server error"});
    }
};

// Resend code
export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  console.log(email)

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }

    // generate a new code
    const newCode = Math.floor(100000 + Math.random() * 900000); // 6-digit
    user.verificationToken = String(newCode);
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // send email
    await sendVerificationEmail(user.email, newCode); // implement your email sending function

    res.status(200).json({ success: true, message: "Verification code resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Updated login controller
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Return token in response body
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token, // <--- return JWT
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        console.error("Error while trying to login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// forgot password controller
export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exists"
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000 // 1 hour

        // Generate the URL to reset the password
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // update the reset password information in the database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        console.log(resetToken)
        await user.save({ validateBeforeSave: false });

        // sends a URL to the users' email to reset password
        await sendPasswordResetEmail(user.email, resetUrl);

        // send a SUCCESS response to the client
        res.status(201).json({
            success:true,
            message: "Password reset link sent to your email"
        });
    }
    catch(error){

        console.log(`Error: ${error.message}`);

        res.status(400).json({
            success:false,
            message: error.message
        });
    }
};

// reset password controller
export const resetPassword = async (req, res) => {
    try{
        const {token} = req.params;
        const {password} = req.body;
        console.log(password)
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });
        
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'Reset token expired!'
            });
        }

        // Update the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        
        // update the reset password information
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        // save user in the database
        await user.save();

        // send success email to the client
        sendResetSuccessEmail(user.email);

        // send response back to the client
        res.status(200).json({
            success:true,
            message: 'Password reset successfully'
        });

    }
    catch(error){
        console.log(`Error while resetting the password: ${error}`);
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
};

// check authentication
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User does not exist" });

    res.status(200).json({ success: true, user }); // already excluded password
  } catch (error) {
    console.error('Error in checkAuth:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update controller
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    // Handle photo upload
    if (req.file) {
      user.photo = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};

// Logout controller
export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success:true,
        message: "Logged out successfully!"
    });
};