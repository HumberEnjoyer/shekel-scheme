import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import fetch_router from "./routers/fetch_router.js";
import upload_router from "./routers/upload_router.js";
import auth_router from "./routers/auth_router.js";

// Load env vars
dotenv.config();

// Enable __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//routes
app.use("/fetch", fetch_router);
app.use("/upload", upload_router);
app.use("/auth", auth_router); // Use the auth router

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});