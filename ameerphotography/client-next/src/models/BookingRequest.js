import mongoose from "mongoose";

const bookingRequestSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestType: { type: String, enum: ['edit', 'cancel'], required: true },
  updatedData: { type: Object },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.BookingRequest || mongoose.model('BookingRequest', BookingRequestSchema);
