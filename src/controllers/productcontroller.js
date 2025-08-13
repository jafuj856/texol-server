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
  console.log(req.files, "[[[");

  if (req.files && req.files.length === 0) {
    throw new Error("images is required");
  }
  const images =
    req?.files?.length > 0 ? req?.files?.map((file) => file.filename) : [];
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

// update section

export const updateProductById = asyncHandler(async (req, res) => {
  const { id, name, description, price, stock } = req.body;
  if (!id) {
    return res.status(400).message("please provide product id");
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).message("product not found");
    }
    if (req.files && req.files?.length > 0) {
      product.images = req.files.map((file) => file.filename);
    }
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (stock) product.stock = stock;
    const updateProduct = await product.save();
    res.status(200).json(updateProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).message({ message: err.message });
  }
});
