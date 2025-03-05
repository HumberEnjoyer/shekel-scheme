import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import fetch_router from "./routers/fetch_router.js";
import upload_router from "./routers/upload_router.js";

// Enable __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;



// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve the static React build
app.use(express.static(path.join(__dirname, "build")));

// routes
app.use("/fetch", fetch_router);
app.use("/upload", upload_router);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
