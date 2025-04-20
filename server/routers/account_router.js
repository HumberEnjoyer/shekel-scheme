import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

// Fetch purchased NFTs
router.get("/account", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("purchasedNFTs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ purchasedNFTs: user.purchasedNFTs });
  } catch (error) {
    console.error("Error fetching purchased NFTs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add funds to the user's account
router.put("/funds", verifyToken, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount. Please enter a positive number." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Correctly add the amount without multiplication
    user.shekelTokens += amount;
    await user.save();

    res.status(200).json({ balance: user.shekelTokens });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Fetch user's balance
router.get("/balance", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ balance: user.shekelTokens });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;