import mongoose from 'mongoose';
import './collectionModel.js';    

const nftSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String, required: true, trim: true },

    imageUrl:     { type: String, required: true },
    metadataUrl:  { type: String, required: true },

    creator:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    /* ------------ reference to a Collection ------------ */
    collectionRef:{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection', default: null },

    mintedDate:   { type: Date,  default: Date.now },
    price:        { type: Number, required: true, min: 0 },
    isForSale:    { type: Boolean, default: false },

    tokenId:      { type: String, required: true, unique: true },
    contractAddress: { type: String, required: true },
    blockchain:   { type: String, required: true, enum: ['Ethereum','Polygon','Binance'] },
  },
  {
    timestamps: true,
    toJSON:  { virtuals: true },
    toObject:{ virtuals: true },
  }
);

/* ---------- virtual counts ---------- */
nftSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'nft',
  count: true,
});

nftSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'nft',
  count: true,
});

/* ---------- helpers ---------- */
nftSchema.methods.markAsSold = async function (newOwnerId) {
  this.isForSale = false;
  this.owner     = newOwnerId;
  await this.save();
};

nftSchema.statics.findForSale = function () {
  return this.find({ isForSale: true });
};

export default mongoose.model('NFT', nftSchema);
