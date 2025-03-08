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
  const nfts = getNFTs();
  res.json(nfts);
});

// Upload new NFT
router.post("/nft", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { title, price } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    const nfts = getNFTs();
    const newNFT = {
      id: nfts.length + 1,
      title,
      price: `$${price}`,
      image: `/${req.file.filename}`,
    };

    nfts.push(newNFT);
    saveNFTs(nfts);

    res.status(201).json(newNFT);
  } catch (error) {
    console.error("Error creating NFT:", error);
    res.status(500).json({ error: "Failed to create NFT" });
  }
});

export default router;
