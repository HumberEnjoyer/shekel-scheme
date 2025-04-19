import express from "express";
import upload from "../middleware/multer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load existing NFTs from JSON file
const nftsFile = path.join(__dirname, "..", "nfts.json");
const getNFTs = () => {
  if (fs.existsSync(nftsFile)) {
    return JSON.parse(fs.readFileSync(nftsFile, "utf8"));
  }
  return [];
};

const saveNFTs = (nfts) => {
  fs.writeFileSync(nftsFile, JSON.stringify(nfts, null, 2));
};

// Get all NFTs
router.get("/nfts", (req, res) => {
  try {
    const nfts = getNFTs();
    res.json(nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
});

// Upload new NFT
router.post("/nft", upload.single("image"), (req, res) => {
  try {
    // Validate image upload
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Validate title and price
    const { title, price } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    // Validate price format
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    // Load existing NFTs
    const nfts = getNFTs();

    // Create new NFT object
    const newNFT = {
      id: nfts.length + 1,
      title,
      price: `$${parseFloat(price).toFixed(2)}`, // Format price as a currency
      image: `/uploads/${req.file.filename}`, // Ensure correct path for the image
    };

    // Save the new NFT
    nfts.push(newNFT);
    saveNFTs(nfts);

    res.status(201).json(newNFT);
  } catch (error) {
    console.error("Error creating NFT:", error);
    res.status(500).json({ error: "Failed to create NFT" });
  }
});

// Delete an NFT by ID
router.delete("/nft/:id", (req, res) => {
  try {
    const { id } = req.params;

    // Load existing NFTs
    const nfts = getNFTs();

    // Find the NFT to delete
    const nftIndex = nfts.findIndex((nft) => nft.id === parseInt(id));
    if (nftIndex === -1) {
      return res.status(404).json({ error: "NFT not found" });
    }

    // Remove the NFT from the array
    const [deletedNFT] = nfts.splice(nftIndex, 1);

    // Save the updated NFTs
    saveNFTs(nfts);

    // Delete the associated image file
    const imagePath = path.join(__dirname, "..", "uploads", path.basename(deletedNFT.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "NFT deleted successfully", deletedNFT });
  } catch (error) {
    console.error("Error deleting NFT:", error);
    res.status(500).json({ error: "Failed to delete NFT" });
  }
});

export default router;