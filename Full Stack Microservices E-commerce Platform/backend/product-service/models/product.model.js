import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    productId:{
        type:String,
        unique: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: {
        type:String,
        required: true
    },
    inventory_count: {
        type: Number,
        required: true,
        default: 0
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: { type:String },
    isbn: { type: String, unique: true },
    author: { type: String},
    coverImage: { type:String, required: true},
    oldPrice: {
        type: Number,
    },
    newPrice: {
        type: Number,
        required: true,
    },
});

// Pre-save hook to auto-generate categoryId
productSchema.pre("save", async function (next) {
  if (this.productId) {
    return next(); // already set manually
  }

  try {
    // Find the last created category
    const lastProduct = await mongoose.model("Product").findOne().sort({ productId: -1 });

    if (!lastProduct || !lastProduct.productId) {
      this.productId = "P01"; // first category
    } else {
      // Extract the number part (e.g. "P05" -> 5)
      const lastNumber = parseInt(lastProduct.productId.substring(1));
      const newNumber = lastNumber + 1;

      // Format with leading zeros (P01, P02, ...)
      this.productId = "P" + newNumber.toString().padStart(2, "0");
    }

    next();
  } catch (error) {
    next(error);
  }
});

// PRODUCT MODEL
export const Product = mongoose.model('Product', productSchema);

