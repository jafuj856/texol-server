import Cart from "../models/Cart.js";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

export const productAddToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
    }
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].qty += qty;
    } else {
      cart.cartItems.push({
        product: product._id,
        name: product.name,
        qty,
        price: product.price,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {}
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await cart.save();
  res.json(cart);
});

export const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.find();

    if (!cart || cart.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});
