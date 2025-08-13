import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    default: 0.0,
    maxlength: [5, "Product price cannot exceed 5 digits"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
    trim: true,
    maxlength: [100, "Product category cannot exceed 100 characters"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    default: 0,
    maxlength: [5, "Product stock cannot exceed 5 digits"],
    min: [0, "Stock cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
    trim: true,
    maxlength: [500, "Product description cannot exceed 500 characters"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Product", productSchema);
