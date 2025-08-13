import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// get All products
export const getAllProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]; // case-insensitive search
  }
  //   category
  if (category) {
    query.category = category;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice);
    }
  }
  try {
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error.message);
  }
});

// addProduct Admin

export const addProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stock, description } = req.body;

  const images = req.files.map((file) => file.filename);
  if (!name || !description || !price || !category || !stock || !images) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  try {
    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error.message);
  }
});
