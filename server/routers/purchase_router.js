import express from "express";
import User from "../models/userModel.js";
import NFT from "../models/nftModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
// create a new express router instance for handling purchase-related routes

router.post("/purchase", verifyToken, async (req, res) => {
  // define a post route for purchasing an nft, requiring token verification
  const { nftId } = req.body;
  // extract the nft id from the request body

  try {
    const nft = await NFT.findById(nftId);
    // fetch the nft by its id from the database

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }
    // return a 404 error if the nft does not exist

    const user = await User.findById(req.user.id);
    // fetch the user making the purchase by their id from the token

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // return a 404 error if the user does not exist

    if (user.purchasedNFTs.includes(nftId)) {
      return res.status(400).json({ message: "You already own this NFT." });
    }
    // return a 400 error if the user already owns the nft

    if (user.shekelTokens < nft.price) {
      return res.status(400).json({ message: "Insufficient Shekel Coins." });
    }
    // return a 400 error if the user does not have enough tokens to purchase the nft

    user.shekelTokens -= nft.price;
    // deduct the nft price from the user's token balance

    nft.owner = user._id;
    nft.isForSale = false;
    // update the nft's owner and mark it as no longer for sale

    user.purchasedNFTs.push(nft._id);
    // add the nft to the user's list of purchased nfts

    await user.save();
    await nft.save();
    // save the updated user and nft data to the database

    res.status(200).json({ 
      message: "Purchase successful", 
      balance: user.shekelTokens,
      nft 
    });
    // respond with a success message, the user's updated balance, and the purchased nft
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Server error" });
    // handle any server errors and respond with a 500 status code
  }
});

export default router;