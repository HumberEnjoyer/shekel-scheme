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
// set up express router and define file path utilities for handling file paths

router.post('/nft', verifyToken, upload.single('image'), async (req, res) => {
  // define a post route for uploading an nft, requiring token verification and image upload
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    // check if an image file is uploaded

    const { title, description = 'Auto-generated NFT', price, collectionId } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'Title and price are required' });
    if (isNaN(price) || price <= 0) return res.status(400).json({ error: 'Price must be positive' });
    // validate the nft details from the request body

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
    // create a new nft object with the provided details

    const savedNFT = await newNFT.save();
    // save the nft to the database

    const user = await User.findById(req.user.id);
    user.createdNFTs.push(savedNFT._id);
    await user.save();
    // update the user's created nfts list and save the user

    res.status(201).json(savedNFT);
    // respond with the created nft
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ error: 'Failed to create NFT' });
    // handle any server errors
  }
});

router.get('/nfts', async (_req, res) => {
  // define a get route for fetching all nfts
  try {
    const nfts = await NFT.find().populate('creator owner collectionRef');
    // fetch all nfts and populate related fields

    res.status(200).json(nfts);
    // respond with the list of nfts
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
    // handle any server errors
  }
});

router.delete("/nft/:id", verifyToken, async (req, res) => {
  // define a delete route for removing an nft by id, requiring token verification
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) return res.status(404).json({ error: "NFT not found" });
    // check if the nft exists

    if (
      nft.creator.toString() !== req.user.id &&
      nft.owner.toString() !== req.user.id
    )
      return res.status(403).json({ error: "Not authorised" });
    // check if the user is authorized to delete the nft

    await nft.remove();
    res.status(200).json({ message: "NFT deleted" });
    // delete the nft and respond with a success message
  } catch (err) {
    console.error("Error deleting NFT:", err);
    res.status(500).json({ error: "Failed to delete NFT" });
    // handle any server errors
  }
});

export default router;
