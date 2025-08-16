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
        image: product.images?.[0] || "",
      });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500);
    throw new Error(error?.message);
  }
});

export const updateCartItemQty = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { action } = req.body;

  if (!["increase", "decrease"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  let currentQty = Number(cart.cartItems[itemIndex].qty) || 1;

  if (action === "increase") {
    currentQty += 1;
  } else if (action === "decrease") {
    currentQty -= 1;
  }

  if (currentQty <= 0) {
    cart.cartItems.splice(itemIndex, 1);
  } else {
    cart.cartItems[itemIndex].qty = currentQty;
    if (!cart.cartItems[itemIndex].image) {
      cart.cartItems[itemIndex].image = "";
    }
  }
  const totalQty = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  // console.log(cart);

  await cart.save();

  res.status(200).json({
    cartItems: cart.cartItems,
    totalQty,
    totalPrice,
  });
});

export const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        cartItems: [],
        totalQty: 0,
        totalPrice: 0,
      });
    }
    const totalQty = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.cartItems.reduce(
      (acc, item) => acc + item.qty * item.price,
      0
    );

    res.status(200).json({
      cartItems: cart.cartItems,
      totalQty,
      totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
