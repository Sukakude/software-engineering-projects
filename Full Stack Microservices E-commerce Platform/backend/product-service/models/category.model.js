import mongoose from "mongoose";

// PRODUCT CATEGORY SCHEMA
const categorySchema = new mongoose.Schema({
    categoryId:{
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    description: {
        type: String,
        required: false,
        trim:true
    }
});

// Pre-save hook to auto-generate categoryId
categorySchema.pre("save", async function (next) {
  if (this.categoryId) {
    return next(); // already set manually
  }

  try {
    // Find the last created category
    const lastCategory = await mongoose.model("Category").findOne().sort({ categoryId: -1 });

    if (!lastCategory || !lastCategory.categoryId) {
      this.categoryId = "C01"; // first category
    } else {
      // Extract the number part (e.g. "C05" -> 5)
      const lastNumber = parseInt(lastCategory.categoryId.substring(1));
      const newNumber = lastNumber + 1;

      // Format with leading zeros (C01, C02, ...)
      this.categoryId = "C" + newNumber.toString().padStart(2, "0");
    }

    next();
  } catch (error) {
    next(error);
  }
});

// PRODUCT CATEGORY MODEL
export const Category = mongoose.model('Category', categorySchema);