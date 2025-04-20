import mongoose from 'mongoose';

// Define the schema for a comment
// Define the schema for a transaction
// This schema represents a transaction between a buyer and a seller for an NFT.
const transactionSchema = new mongoose.Schema({
    nft: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be positive']
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    failureReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
