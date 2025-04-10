import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    metadataUrl: {
        type: String,
        required: [true, 'Metadata URL is required']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },
    mintedDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isForSale: {
        type: Boolean,
        default: false
    },
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    blockchain: {
        type: String,
        required: true,
        enum: ['Ethereum', 'Polygon', 'Binance']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual fields for likes and comments count
nftSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'nft',
    count: true
});

nftSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'nft',
    count: true
});

const NFT = mongoose.model('NFT', nftSchema);

export default NFT;
