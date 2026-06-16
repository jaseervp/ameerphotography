import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String }, // Optional for social login
  googleId: { type: String }, // Store google ID
  phone: String,
  profilePic: String,
  servicePreferences: [String],
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  fcmToken: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
