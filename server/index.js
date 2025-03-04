import express from "express";
import cors from "cors";

import fetch_router from "./routers/fetch_router.js";
import upload_router from "./routers/upload_router.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// routes
app.use("/fetch", fetch_router);
app.use("/upload", upload_router);

app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
