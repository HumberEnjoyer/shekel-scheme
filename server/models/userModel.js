import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    walletAddress: {
        type: String,
        required: [true, 'Wallet address is required'],
        unique: true
    },
    profile: {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        bio: { type: String, maxlength: 500 },
        avatar: { type: String, default: 'default-avatar.png' }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdNFTs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT'
    }],
    ownedNFTs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT'
    }],
    collections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
