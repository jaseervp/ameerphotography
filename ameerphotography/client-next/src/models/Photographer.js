import mongoose from "mongoose";

const photographerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  experience: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  website: { type: String },
  image: { type: String },
  cloudinaryId: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Photographer || mongoose.model('Photographer', PhotographerSchema);
