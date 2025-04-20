import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the schema for the user model
// This schema includes fields for username, email, password, wallet address, profile information, and more.
// It also includes methods for hashing passwords and comparing passwords during login.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required'],
      unique: true,
    },
    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      bio: { type: String, maxlength: 500 },
      avatar: { type: String, default: 'default-avatar.png' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    shekelTokens: {
      type: Number,
      default: 30,
    },
    createdNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NFT' }],
    ownedNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NFT' }],
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    purchasedNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NFT' }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
// This middleware function is executed before saving a user document to the database.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
// This method is used to compare the entered password with the hashed password stored in the database.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate a JWT token method
const User = mongoose.model('User', userSchema);
export default User;