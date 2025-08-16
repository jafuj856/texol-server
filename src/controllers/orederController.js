import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = asyncHandler(async (req, res) => {
  const io = req.app.get("io");
  const { shippingAddress, paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.cartItems.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const order = new Order({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  const createdOrder = await order.save();

  for (const item of cart.cartItems) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    product.stock = product.stock - item.qty;
    await product.save();

    io.emit("product_stock_updated", {
      productId: product._id,
      name: product.name,
      remainingStock: product.stock,
    });
  }

  io.emit("new_order", {
    orderId: createdOrder._id,
    items: createdOrder.orderItems.map((i) => ({
      productId: i.product,
      name: i.name,
      quantity: i.qty,
    })),
    time: new Date(),
  });

  cart.cartItems = [];
  await cart.save();

  res.status(201).json(createdOrder);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500);
    throw new Error(err?.message);
  }
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status || order.status;
  await order.save();

  res.json({ message: "Order status updated", order });
});
