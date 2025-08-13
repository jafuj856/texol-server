import User from "../models/User.js";
import genarateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import { isValidEmail, isValidPassword } from "../utils/helper.js";

// registration
export const registerUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request body is missing");
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }
  if (!isValidPassword(password)) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exist");
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: genarateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error("Duplicate field value entered");
    }
    res.status(500);
    throw new Error("Server error: " + err.message);
  }
});

// login

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: genarateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
