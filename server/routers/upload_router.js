import express from 'express';
import upload from '../middleware/multer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import NFT from '../models/nftModel.js';
import User from '../models/userModel.js';
import '../models/collectionModel.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ───────────  POST /upload/nft  ─────────── */
router.post('/nft', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const { title, description = 'Auto-generated NFT', price, collectionId } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'Title and price are required' });
    if (isNaN(price) || price <= 0) return res.status(400).json({ error: 'Price must be positive' });

    const newNFT = new NFT({
      title,
      description,
      price: Number(price).toFixed(2),
      imageUrl: `/uploads/${req.file.filename}`,
      metadataUrl: `/metadata/${req.file.filename}`,
      creator: req.user.id,
      owner: req.user.id,
      collectionRef: collectionId || null,
      isForSale: true,
      blockchain: 'Ethereum',
      contractAddress: '0x123456789abcdef',
      tokenId: `token-${Date.now()}`,
    });

    const savedNFT = await newNFT.save();

    const user = await User.findById(req.user.id);
    user.createdNFTs.push(savedNFT._id);
    await user.save();

    res.status(201).json(savedNFT);
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ error: 'Failed to create NFT' });
  }
});

/* ───────────  GET /upload/nfts  ─────────── */
router.get('/nfts', async (_req, res) => {
  try {

    const nfts = await NFT.find().populate('creator owner collectionRef');
    res.status(200).json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

/* ─────────────  DELETE /upload/nft/:id  (clean up) ────────────── */
router.delete("/nft/:id", verifyToken, async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) return res.status(404).json({ error: "NFT not found" });

    if (
      nft.creator.toString() !== req.user.id &&
      nft.owner.toString() !== req.user.id
    )
      return res.status(403).json({ error: "Not authorised" });

    await nft.remove();
    res.status(200).json({ message: "NFT deleted" });
  } catch (err) {
    console.error("Error deleting NFT:", err);
    res.status(500).json({ error: "Failed to delete NFT" });
  }
});

export default router;
