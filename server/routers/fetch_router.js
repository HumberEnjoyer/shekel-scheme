import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/userModel.js";
import NFT from "../models/nftModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route to fetch an image file
router.get("/fetch-image", (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).send("File name is required");
  }

  const safeFilename = path.basename(filename); // Prevent path traversal
  const filePath = path.join(__dirname, "../uploads", safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.sendFile(filePath);
});

// Route to fetch weather data (example data)
router.get("/data", (req, res) => {
  const data = {
    coord: {
      lon: -123.12,
      lat: 49.28,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    base: "stations",
    main: {
      temp: 285.15,
      feels_like: 283.4,
      temp_min: 284.26,
      temp_max: 286.48,
      pressure: 1015,
      humidity: 72,
    },
    visibility: 10000,
    wind: {
      speed: 3.6,
      deg: 270,
    },
    clouds: {
      all: 0,
    },
    dt: 1707123456,
    sys: {
      type: 2,
      id: 1234,
      country: "CA",
      sunrise: 1707100000,
      sunset: 1707145678,
    },
    timezone: -28800,
    id: 6173331,
    name: "Vancouver",
    cod: 200,
  };

  res.json({ data: data });
});

// Route to fetch NFTs owned by a user
router.get("/user-nfts", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("ownedNFTs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ ownedNFTs: user.ownedNFTs });
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    res.status(500).json({ message: "Failed to fetch user NFTs" });
  }
});

// Route to fetch all NFTs for sale
router.get("/nfts-for-sale", async (req, res) => {
  try {
    const nftsForSale = await NFT.find({ isForSale: true });
    res.status(200).json({ nfts: nftsForSale });
  } catch (error) {
    console.error("Error fetching NFTs for sale:", error);
    res.status(500).json({ message: "Failed to fetch NFTs for sale" });
  }
});

// Route to fetch details of a specific NFT
router.get("/nft/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const nft = await NFT.findById(id).populate("creator owner");
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    res.status(200).json({ nft });
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    res.status(500).json({ message: "Failed to fetch NFT details" });
  }
});

export default router;