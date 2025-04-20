import express from "express";
import User from "../models/userModel.js";
import NFT from "../models/nftModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/purchase", verifyToken, async (req, res) => {
  const { nftId } = req.body;

  try {
    const nft = await NFT.findById(nftId);
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.purchasedNFTs.includes(nftId)) {
      return res.status(400).json({ message: "You already own this NFT." });
    }

    if (user.shekelTokens < nft.price) {
      return res.status(400).json({ message: "Insufficient Shekel Coins." });
    }

    user.shekelTokens -= nft.price;
    nft.owner = user._id;
    nft.isForSale = false;

    user.purchasedNFTs.push(nft._id);

    await user.save();
    await nft.save();

    res.status(200).json({ 
      message: "Purchase successful", 
      balance: user.shekelTokens,
      nft 
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
