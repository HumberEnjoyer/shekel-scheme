import express from "express";
import User from "../models/userModel.js";
import NFT from "../models/nftModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Purchase an NFT
router.post("/purchase", verifyToken, async (req, res) => {
  const { nftId } = req.body;

  try {
    // Find the NFT
    const nft = await NFT.findById(nftId);
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    // Check if the user already owns the NFT
    const user = await User.findById(req.user.id);
    if (user.purchasedNFTs.includes(nftId)) {
      return res.status(400).json({ message: "You already own this NFT." });
    }

    // Add the NFT to the user's purchased list
    user.purchasedNFTs.push(nftId);
    await user.save();

    res.status(200).json({ message: "Purchase successful", nft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;