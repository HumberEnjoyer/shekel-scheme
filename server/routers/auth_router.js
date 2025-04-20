import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("Register endpoint hit"); // Log when the endpoint is hit
    console.log("Request body:", req.body); // Log the incoming request body

    const { username, email, password, walletAddress } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { walletAddress }] });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({ message: "Email or wallet address already exists." });
    }

    const newUser = new User({ username, email, password, walletAddress });
    const savedUser = await newUser.save();
    console.log("User registered successfully:", savedUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Login endpoint hit"); // Log when the endpoint is hit
    console.log("Request body:", req.body); // Log the incoming request body

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", user);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("Login successful for user:", user);

    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;