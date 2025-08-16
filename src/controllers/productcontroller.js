import path from "path";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import { body } from "express-validator";

// get All products
export const getAllProducts = asyncHandler(async (req, res) => {
  console.log(req);

  const { search, category, minPrice, maxPrice } = req.query;
  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

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
  console.log(req.body, "[[[");
  const { name, price, category, stock, description } = req.body;

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
      stock,
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
  console.log(req.body);

  if (!id) {
    res.status(400);
    throw new Error("please provide product id");
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(401);
      throw new Error("product not found");
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
    res.status(500);
    throw new Error(err.message);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("please provide product id");
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(401);
      throw new Error("product not found");
    }
    if (product.images && product?.images?.length > 0) {
      product?.images?.forEach((element) => {
        const imagePath = path.join("uploads", element);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image ${element}:`, err.message);
          }
        });
      });
    }
    await product.deleteOne();
    res.status(200);
    res.message("product deleted success fully");
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});
