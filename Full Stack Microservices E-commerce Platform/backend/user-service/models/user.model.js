import mongoose, { Schema } from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
   email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type:String
    },
    photo:{
        type:String,
    },
    phone:{
        type: String,
        required: false
    },
    address: {
        type: Schema.Types.ObjectId, 
        ref: 'address.model',
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: [
        {
            product: {
                _id: { type: String, required: true },
                name: { type:String },
                banner: { type:String },
                price: { type:Number }
            },
            unit: {
                type: Number,
                required: true
            }
        }
    ],
    orders:[
        {
            _id: { type: String, required: true},
            amount: { type: String},
            date: {type: Date, default: Date.now()}
        }
    ],
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type:Boolean,
        default: false
    },
    resetPasswordToken: String,             // Token generated when the user wants to reset the password
    resetPasswordExpiresAt: Date,           // Expiration date of the token generated
    verificationToken: String,              // Generates a verification token to confirm the changes
    verificationTokenExpiresAt: Date        // Expiration date of the verification token
}, {timestamps:true});

export const User = mongoose.model('User', userSchema);


