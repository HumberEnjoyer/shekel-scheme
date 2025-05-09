import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

// initialize dotenv to load environment variables
dotenv.config();

// create a new express router
const router = express.Router();

// route to handle user registration
router.post("/register", async (req, res) => {
  try {
    console.log("Register endpoint hit"); // log when the endpoint is hit
    console.log("Request body:", req.body); // log the incoming request body

    // destructure user details from the request body
    const { username, email, password, walletAddress } = req.body;

    // check if a user with the same email or wallet address already exists
    const existingUser = await User.findOne({ $or: [{ email }, { walletAddress }] });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({ message: "Email or wallet address already exists." });
    }

    // create a new user and save it to the database
    const newUser = new User({ username, email, password, walletAddress });
    const savedUser = await newUser.save();
    console.log("User registered successfully:", savedUser);

    // send a success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// route to handle user login
router.post("/login", async (req, res) => {
  try {
    console.log("Login endpoint hit"); // log when the endpoint is hit
    console.log("Request body:", req.body); // log the incoming request body

    // destructure email and password from the request body
    const { email, password } = req.body;

    // find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // check if the provided password matches the stored password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", user);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // generate a jwt token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("Login successful for user:", user);

    // send a success response with the token and user details
    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;