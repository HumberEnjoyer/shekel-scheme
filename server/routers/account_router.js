import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/account", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("purchasedNFTs");
    res.status(200).json({ purchasedNFTs: user.purchasedNFTs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;