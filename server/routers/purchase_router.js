import express from "express";
import User from "../models/userModel.js";
import NFT from "../models/nftModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ───────────────────────────────────────────────────────────────
// Purchase an NFT – can only succeed while the NFT is “for sale”
// ───────────────────────────────────────────────────────────────
router.post("/purchase", verifyToken, async (req, res) => {
  const { nftId } = req.body;

  try {
    const nft = await NFT.findById(nftId);
    if (!nft)           return res.status(404).json({ message: "NFT not found" });
    if (!nft.isForSale) return res.status(400).json({ message: "NFT already sold" });

    const buyer  = await User.findById(req.user.id);
    const seller = await User.findById(nft.owner);

    if (!buyer || !seller)
      return res.status(404).json({ message: "User not found" });

    if (buyer._id.equals(seller._id))
      return res.status(400).json({ message: "You already own this NFT." });

    if (buyer.shekelTokens < nft.price)
      return res.status(400).json({ message: "Insufficient Shekel Coins." });

    /* ─── handle balances ─── */
    buyer.shekelTokens  -= nft.price;
    seller.shekelTokens += nft.price;

    /* ─── transfer ownership ─── */
    nft.owner     = buyer._id;
    nft.isForSale = false;

    /* ─── move NFT between user arrays ─── */
    buyer.purchasedNFTs.push(nft._id);
    await seller.updateOne({ $pull: { purchasedNFTs: nft._id } });

    await Promise.all([buyer.save(), seller.save(), nft.save()]);

    res.status(200).json({
      message: "Purchase successful",
      balance: buyer.shekelTokens,
      nft,
    });
  } catch (err) {
    console.error("Error processing purchase:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
