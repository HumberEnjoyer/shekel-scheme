import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Comment from "../models/commentModel.js";

const router = express.Router();

// Get comments for an NFT
router.get("/nft/:nftId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ nft: req.params.nftId })
      .populate("user", "username profile.avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a comment
router.post("/nft/:nftId/comments", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = new Comment({
      text,
      user: req.user.id,
      nft: req.params.nftId,
    });
    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate("user", "username profile.avatar");
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment
router.delete("/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
