import mongoose from 'mongoose';

// Define the schema for a comment
// This schema will be used to store comments on NFTs
// It includes fields for the user who made the comment, the NFT it belongs to, the text of the comment, and any replies
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nft: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT',
        required: true
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate likes
likeSchema.index({ user: 1, nft: 1 }, { unique: true });

// Create the model using the schema
const Like = mongoose.model('Like', likeSchema);

export default Like;
