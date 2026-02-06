import mongoose from "mongoose";

const addressSchema = new Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
});

model.exports = mongoose.model('Address', addressSchema);