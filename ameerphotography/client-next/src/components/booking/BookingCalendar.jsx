import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User, Camera, X, Phone, Mail, MapPin, Calendar, CheckCircle, Info, Plus } from 'lucide-react';
import api from "@/lib/api";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'confirmed', 'completed'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Wedding Photography',
    eventDate: '',
    time: '',
    venue: '',
    message: ''
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone || !addForm.email || !addForm.eventDate || !addForm.serviceType) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await api.post('/enquiries', { ...addForm, status: 'confirmed' });
      toast.success('Booking added successfully');
      setIsAddModalOpen(false);
      setAddForm({ name: '', phone: '', email: '', serviceType: 'Wedding Photography', eventDate: '', time: '', venue: '', message: '' });
      fetchBookings();
    } catch (err) {
      console.error('Failed to add manual booking', err);
      toast.error('Failed to add booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries/calendar');
      const enquiries = res.data.data || [];
      
      const mappedBookings = {};
      enquiries.forEach(enq => {
        if (enq.eventDate) {
          const d = new Date(enq.eventDate);
          const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (!mappedBookings[date]) {
            mappedBookings[date] = [];
          }
          mappedBookings[date].push(enq);
        }
      });
      setBookings(mappedBookings);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Failed to update status');
    }
  };
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 border-green-200 text-green-700';
      case 'completed': return 'bg-gray-100 border-gray-300 text-gray-700';
      default: return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-heading mb-1">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Booking Schedule</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex p-1 bg-light rounded-xl text-[9px] uppercase tracking-widest font-bold">
            {['all', 'confirmed', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterStatus === s ? 'bg-white shadow-sm text-primary' : 'text-secondary/40 hover:text-primary'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-light rounded-full transition-colors"><ChevronLeft size={20} /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-light rounded-full transition-colors"><ChevronRight size={20} /></button>
          </div>

          <button 
            onClick={() => {
              setAddForm({ name: '', phone: '', email: '', serviceType: 'Wedding Photography', eventDate: '', time: '', venue: '', message: '' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-md"
          >
            <Plus size={14} /> Add Booking
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-7 min-w-[800px] gap-px bg-black/5 rounded-2xl overflow-hidden border border-black/5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-[#FBFBFB] py-4 text-center text-[10px] uppercase tracking-widest font-bold text-secondary/40">
            {d}
          </div>
        ))}
        
        {days.map((day, i) => {
          const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
          let dayBookings = day ? bookings[dateStr] || [] : [];
          
          if (filterStatus !== 'all') {
            dayBookings = dayBookings.filter(b => b.status === filterStatus);
          }

          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div 
              key={i} 
              onClick={() => {
                if (day) {
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  setAddForm({ name: '', phone: '', email: '', serviceType: 'Wedding Photography', eventDate: dateStr, time: '', venue: '', message: '' });
                  setIsAddModalOpen(true);
                }
              }}
              className={`bg-white min-h-[120px] p-2 relative group hover:bg-light/30 transition-colors cursor-pointer ${!day ? 'bg-[#FDFDFD] cursor-default' : ''}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-medium mb-1 inline-block ${isToday ? 'w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center' : 'text-secondary/60'}`}>
                    {day}
                  </span>
                  
                  {dayBookings.length > 0 && (
                    <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar">
                      {dayBookings.map((booking) => (
                        <motion.div 
                          key={booking._id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                          className={`p-1.5 rounded-lg text-[9px] font-bold uppercase tracking-tighter border cursor-pointer hover:shadow-sm transition-all ${getStatusColor(booking.status)}`}
                          title={`${booking.name} - ${booking.serviceType}`}
                        >
                          <p className="truncate">{booking.name}</p>
                          <div className="flex items-center gap-1 opacity-60 truncate">
                            <Camera size={10} /> {booking.serviceType}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Hover tooltip for event count if many */}
                  {dayBookings.length > 2 && (
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      +{dayBookings.length - 2}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 border-t border-black/5 pt-8">
        {[
          { color: 'bg-green-500', label: 'Confirmed' },
          { color: 'bg-gray-500', label: 'Completed' },
          { color: 'bg-primary', label: 'Today' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary/40">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl max-w-lg w-full p-6 md:p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 p-2 hover:bg-light rounded-full transition-colors text-secondary/40 hover:text-primary"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <span className={`text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
                <h3 className="text-3xl font-heading mt-4 mb-2">{selectedBooking.serviceType}</h3>
                <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Booking Details</p>
              </div>

              <div className="space-y-6 text-sm text-secondary/80">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Client</p>
                    <p className="font-bold text-primary">{selectedBooking.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Phone</p>
                      <p className="text-xs font-light">{selectedBooking.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Email</p>
                      <p className="text-xs font-light truncate max-w-[150px]">{selectedBooking.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Event Date</p>
                      <p className="text-xs font-light">{selectedBooking.eventDate ? new Date(selectedBooking.eventDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Time</p>
                      <p className="text-xs font-light">{selectedBooking.time || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.venue && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Venue</p>
                      <p className="text-xs font-light">{selectedBooking.venue}</p>
                    </div>
                  </div>
                )}

                {selectedBooking.message ? (
                  <div className="bg-light p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mb-2">Message/Notes</p>
                    <p className="text-xs font-light italic">"{selectedBooking.message}"</p>
                  </div>
                ) : (
                  <div className="bg-light p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mb-2">Message/Notes</p>
                    <p className="text-xs font-light italic">"No message provided."</p>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-secondary/60">
                    <Info size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Booking ID</p>
                    <p className="text-xs font-light">{selectedBooking._id}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                {selectedBooking.status === 'confirmed' && (
                  <button 
                    onClick={() => updateStatus(selectedBooking._id, 'completed')}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Mark as Completed
                  </button>
                )}
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 border border-black/10 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:border-black transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Manual Booking Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl max-w-xl w-full p-6 md:p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-light rounded-full transition-colors text-secondary/40 hover:text-primary"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-heading mb-2">Add Booking</h3>
                <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Block Calendar / Add Event</p>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Service Type *</label>
                    <select
                      value={addForm.serviceType}
                      onChange={(e) => setAddForm({ ...addForm, serviceType: e.target.value })}
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="Wedding Photography">Wedding Photography</option>
                      <option value="Cinematic Videography">Cinematic Videography</option>
                      <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                      <option value="Engagement Shoot">Engagement Shoot</option>
                      <option value="Portrait Session">Portrait Session</option>
                      <option value="Maternity Shoot">Maternity Shoot</option>
                      <option value="Other / Event">Other / Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={addForm.phone}
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      placeholder="e.g. client@example.com"
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={addForm.eventDate}
                      onChange={(e) => setAddForm({ ...addForm, eventDate: e.target.value })}
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Event Time</label>
                    <input
                      type="text"
                      value={addForm.time}
                      onChange={(e) => setAddForm({ ...addForm, time: e.target.value })}
                      placeholder="e.g. 10:00 AM - 6:00 PM"
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Venue / Location</label>
                  <input
                    type="text"
                    value={addForm.venue}
                    onChange={(e) => setAddForm({ ...addForm, venue: e.target.value })}
                    placeholder="e.g. Grand Palace Hotel, Ernakulam"
                    className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary/40 mb-2">Message / Notes</label>
                  <textarea
                    value={addForm.message}
                    onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
                    placeholder="Any specific requests, notes, or client preferences..."
                    rows="3"
                    className="w-full bg-[#F9F9F9] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="mt-8 flex gap-4 pt-4 border-t border-black/5">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-on-primary py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-lg"
                  >
                    Save Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 border border-black/10 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:border-black transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCalendar;
