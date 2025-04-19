import express from "express";
import upload from "../middleware/multer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import NFT from "../models/nftModel.js";
import User from "../models/userModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload new NFT
router.post("/nft", verifyToken, upload.single("image"), async (req, res) => {
  try {
    // Validate image upload
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Validate title and price
    const { title, description, price, collectionId } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    // Validate price format
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    // Create new NFT object
    const newNFT = new NFT({
      title,
      description,
      price: parseFloat(price).toFixed(2), // Format price as a number
      imageUrl: `/uploads/${req.file.filename}`, // Path to the uploaded image
      metadataUrl: `/metadata/${req.file.filename}`, // Example metadata path
      creator: req.user.id, // User who created the NFT
      owner: req.user.id, // Initially owned by the creator
      collection: collectionId || null, // Optional collection ID
      isForSale: true, // Default to "for sale"
      blockchain: "Ethereum", // Default blockchain (can be dynamic)
      contractAddress: "0x123456789abcdef", // Example contract address
      tokenId: `token-${Date.now()}`, // Example token ID
    });

    // Save the NFT to the database
    const savedNFT = await newNFT.save();

    // Add the NFT to the user's createdNFTs
    const user = await User.findById(req.user.id);
    user.createdNFTs.push(savedNFT._id);
    await user.save();

    res.status(201).json(savedNFT);
  } catch (error) {
    console.error("Error creating NFT:", error);
    res.status(500).json({ error: "Failed to create NFT" });
  }
});

// Get all NFTs
router.get("/nfts", async (req, res) => {
  try {
    const nfts = await NFT.find().populate("creator owner collection");
    res.status(200).json(nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
});

// Delete an NFT by ID
router.delete("/nft/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the NFT
    const nft = await NFT.findById(id);
    if (!nft) {
      return res.status(404).json({ error: "NFT not found" });
    }

    // Ensure the user is the creator or owner of the NFT
    if (nft.creator.toString() !== req.user.id && nft.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this NFT" });
    }

    // Delete the NFT
    await nft.remove();

    // Delete the associated image file
    const imagePath = path.join(__dirname, "..", "uploads", path.basename(nft.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "NFT deleted successfully", nft });
  } catch (error) {
    console.error("Error deleting NFT:", error);
    res.status(500).json({ error: "Failed to delete NFT" });
  }
});

// Get NFTs owned by the logged-in user
router.get("/user-nfts", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("ownedNFTs");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ ownedNFTs: user.ownedNFTs });
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    res.status(500).json({ error: "Failed to fetch user NFTs" });
  }
});

export default router;