import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;

    // Check if email or wallet address already exists
    const existingUser = await User.findOne({ $or: [{ email }, { walletAddress }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or wallet address already exists." });
    }

    // Do NOT hash manually - let pre('save') handle it
    const newUser = new User({
      username,
      email,
      password, // plain password
      walletAddress
    });

    const savedUser = await newUser.save();
    console.log("Saved user password in DB:", savedUser.password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    console.log("Entered password:", password);
    console.log("Hashed password from DB:", user.password);

    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
