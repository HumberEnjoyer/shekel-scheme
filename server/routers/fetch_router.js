import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// route handling params
router.get("/fetch-image", (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).send("File name is required");
  }
  const filePath = path.join(__dirname, "../uploads", filename);
  res.sendFile(filePath)
});

// route handling fetch data
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

export default router;
