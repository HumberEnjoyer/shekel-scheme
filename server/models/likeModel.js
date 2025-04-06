import mongoose from 'mongoose';

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

const Like = mongoose.model('Like', likeSchema);

export default Like;
