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
    
    // Count photos inside galleries (cover images and image arrays)
    const galleries = await Gallery.find({});
    let galleryPhotosCount = 0;
    galleries.forEach(g => {
      if (g.coverImage && g.coverImage.url) galleryPhotosCount += 1;
      if (g.images && g.images.length) galleryPhotosCount += g.images.length;
    });
    
    const totalPhotos = standalonePhotosCount + galleryPhotosCount;
    
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
