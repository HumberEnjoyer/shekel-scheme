import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Comment from "../models/commentModel.js";

// create a new express router
const router = express.Router();

// route to get comments for a specific NFT
router.get("/nft/:nftId/comments", async (req, res) => {
  try {
    // fetch comments for the given NFT ID, populate user details, and sort by creation date
    const comments = await Comment.find({ nft: req.params.nftId })
      .populate("user", "username profile.avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// route to add a comment to a specific NFT
router.post("/nft/:nftId/comments", verifyToken, async (req, res) => {
  try {
    // extract the comment text from the request body
    const { text } = req.body;

    // create a new comment and associate it with the user and NFT
    const comment = new Comment({
      text,
      user: req.user.id,
      nft: req.params.nftId,
    });
    await comment.save();

    // populate the user details for the newly created comment
    const populatedComment = await Comment.findById(comment._id).populate("user", "username profile.avatar");
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// route to delete a specific comment
router.delete("/comments/:commentId", verifyToken, async (req, res) => {
  try {
    // find the comment by its ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // check if the logged-in user is authorized to delete the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // delete the comment
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
