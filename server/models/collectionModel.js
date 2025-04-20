import mongoose from 'mongoose';

// define the schema for a collection
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
    // enable timestamps for createdAt and updatedAt fields
    timestamps: true,
    // enable virtuals for JSON and object outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// define a virtual field for NFTs in the collection
collectionSchema.virtual('nfts', {
    ref: 'NFT',
    localField: '_id',
    foreignField: 'collection'
});

// create the collection model using the schema
const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
