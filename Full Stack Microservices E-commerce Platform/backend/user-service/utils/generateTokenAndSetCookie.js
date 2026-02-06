import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        {
             // user.role could be "admin" or "customer"
            userId: user._id,
            role: user.role
        }, 
        process.env.JWT_SECRET, 
        {expiresIn: "7d"}
    );
    
    res.cookie("token", token, {
        httpOnly: true, // accessed via HTTP requests only
        secure: process.env.NODE_ENV === "production", // during dev, we will use HTTP and in production HTTPS
        sameSite: "strict", // protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
};