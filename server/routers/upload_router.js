import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

// route handling query -> use ? in URL bar
router.get("/query", (req, res) => {
  console.log(req.query);
  res.send("Welcome to query");
});

// route handling params -> use : in server file, and add params without : inside URL bar
router.get("/params/:variable1", (req, res) => {
  console.log(req.params);
  res.send("Welcome to params");
});

// route handling recieving text from a form -> /upload/text-form
router.post("/text-form", (req, res) => {
  console.log(req.body);
  res.json("Welcome to the text form submission");
});

// route handling recieving file data -> /upload/form-multipart
router.post("/form-multipart", upload.single("image"), (req, res) => {
    console.log("Received Form Data:", req.body);
    console.log("Uploaded File:", req.file);
  
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    res.json({
      message: "Image uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  });

export default router;
