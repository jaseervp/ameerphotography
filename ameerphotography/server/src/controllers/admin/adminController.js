const Enquiry = require('../../models/Enquiry');
const Booking = require('../../models/Booking');
const Photo = require('../../models/Photo');
const Gallery = require('../../models/Gallery');

exports.getStats = async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: 'new' });
    
    // Count standalone photos
    const standalonePhotosCount = await Photo.countDocuments();
    
    // Count portfolio collections (galleries)
    const galleryCount = await Gallery.countDocuments();
    
    const totalPhotos = standalonePhotosCount + galleryCount;
    
    // Get this month's bookings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const thisMonthBookings = await Booking.countDocuments({ date: { $gte: startOfMonth } });

    res.json({
      success: true,
      stats: {
        totalEnquiries,
        pendingEnquiries,
        totalPhotos,
        thisMonthBookings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
