import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

// create a new express router
const router = express.Router();

// route to fetch purchased nfts for the logged-in user
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

// route to add funds to the user's account
router.put("/funds", verifyToken, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    // validate the amount provided in the request
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount. Please enter a positive number." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // add the specified amount to the user's balance
    user.shekelTokens += amount;
    await user.save();

    res.status(200).json({ balance: user.shekelTokens });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// route to fetch the user's balance
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

// route to remove an nft from the user's account
router.put("/remove-nft/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const nftId = req.params.id;
    const index = user.purchasedNFTs.indexOf(nftId);

    // check if the nft exists in the user's purchased nfts
    if (index === -1) {
      return res.status(400).json({ message: "NFT not found in your account" });
    }

    // remove the nft from the user's purchased nfts
    user.purchasedNFTs.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "NFT removed from account" });
  } catch (error) {
    console.error("Error removing NFT:", error);
    res.status(500).json({ message: "Failed to remove NFT" });
  }
});

export default router;