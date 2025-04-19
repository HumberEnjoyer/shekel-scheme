import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
import fetch_router from "./routers/fetch_router.js";
import upload_router from "./routers/upload_router.js";
import auth_router from "./routers/auth_router.js";
import purchase_router from "./routers/purchase_router.js";
import account_router from "./routers/account_router.js";

// Load .env variables
dotenv.config();

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder (for image access)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routers
app.use("/auth", auth_router); // Authentication routes
app.use("/fetch", fetch_router); // Fetch routes for files and data
app.use("/upload", upload_router); // Upload routes for NFTs
app.use("/api", purchase_router); // Purchase routes for buying NFTs
app.use("/api", account_router); // Account routes for user-related operations

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// 404 route
app.use("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory.");
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});