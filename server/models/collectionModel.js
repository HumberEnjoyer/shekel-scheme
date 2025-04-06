import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bannerImageUrl: {
        type: String,
        default: 'default-banner.png'
    },
    category: {
        type: String,
        required: true,
        enum: ['Art', 'Music', 'Photography', 'Sports', 'Gaming', 'Other']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    floorPrice: {
        type: Number,
        default: 0
    },
    totalVolume: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for NFTs in collection
collectionSchema.virtual('nfts', {
    ref: 'NFT',
    localField: '_id',
    foreignField: 'collection'
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
