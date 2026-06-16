import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: "The Story Behind Ameer Photography" },
    image: { type: String }
  },
  bio: {
    title: { type: String, default: "Hello, I'm the eye behind Ameer Photography." },
    paragraphs: [{ type: String }],
    image: { type: String }
  },
  philosophy: {
    quote: { type: String, default: "We believe that a photograph shouldn't just be seen; it should be felt." }
  },
  stats: [{
    num: String,
    label: String
  }],
  gear: {
    cameras: [{ type: String }],
    lenses: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
