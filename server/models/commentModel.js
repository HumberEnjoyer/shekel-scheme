import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nft: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        maxlength: [500, 'Comment cannot be longer than 500 characters']
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    timestamps: true
});

// Index for faster queries
commentSchema.index({ nft: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
