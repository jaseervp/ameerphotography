import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  cloudinaryId: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  title: String,
  category: { 
    type: String
  },
  duration: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
