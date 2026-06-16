import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Trash2, Search,
  Star, MessageSquare, User, Send, Download, QrCode, PlusCircle, List
} from 'lucide-react';
import api from "@/lib/api";
import { toast } from 'sonner';

// ── QR Code (same URL as public Reviews page) ──
const REVIEWS_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173'}/reviews`;
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&data=${encodeURIComponent(REVIEWS_URL)}`;

// ── Star Rating Component ──
const StarRating = ({ value, onChange, readonly = false, size = 20 }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={`transition-colors duration-150 ${
              star <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-black/15'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewManager = () => {
  const [activeView, setActiveView] = useState('reviews'); // 'reviews' | 'add' | 'qr'
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Add review form state
  const [form, setForm] = useState({ name: '', review: '', rating: 0 });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (activeView === 'reviews') fetchReviews();
  }, [activeView, statusFilter, searchTerm]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/admin/all?status=${statusFilter}&search=${searchTerm}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/reviews/${id}/status`, { status });
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.review.trim()) errs.review = 'Review text is required';
    if (!form.rating) errs.rating = 'Please select a rating';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', { ...form, status: 'approved' });
      setSubmitted(true);
      toast.success('Review added and approved!');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-light border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-secondary/30';
  const labelClass = 'text-[10px] uppercase tracking-widest font-bold text-secondary/50 mb-1.5 block';

  const tabs = [
    { id: 'reviews', label: 'All Reviews', icon: List },
    { id: 'add', label: 'Add Review', icon: PlusCircle },
    { id: 'qr', label: 'QR Code', icon: QrCode },
  ];

  return (
    <div className="space-y-6">

      {/* ── Tab Bar ── */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-black/5 shadow-sm w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveView(id); setSubmitted(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              activeView === id
                ? 'bg-primary text-white shadow-md'
                : 'text-secondary/50 hover:text-primary hover:bg-black/[0.03]'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════ ALL REVIEWS ══════════════════════ */}
        {activeView === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-black/5">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-light rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="flex p-1 bg-light rounded-xl gap-1">
                {['all', 'pending', 'approved', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                      statusFilter === s ? 'bg-white shadow-sm text-primary' : 'text-secondary/40 hover:text-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total', count: reviews.length, color: 'text-primary' },
                { label: 'Pending', count: reviews.filter(r => r.status === 'pending').length, color: 'text-amber-500' },
                { label: 'Approved', count: reviews.filter(r => r.status === 'approved').length, color: 'text-green-500' },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm text-center">
                  <p className={`text-2xl font-heading ${color}`}>{count}</p>
                  <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              {loading ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-black/10">
                  <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold">Loading reviews…</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-black/10">
                  <MessageSquare size={40} className="mx-auto mb-4 text-black/10" />
                  <h3 className="text-lg font-heading text-primary/40">No reviews found</h3>
                  <p className="text-[10px] uppercase tracking-widest text-secondary/30 font-bold mt-2">Adjust filters or share the QR code to collect reviews</p>
                </div>
              ) : (
                reviews.map((review, idx) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 border border-black/5">
                          <span className="text-amber-700 font-heading text-lg">{(review.name || 'A')[0].toUpperCase()}</span>
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-heading text-base">{review.name}</h4>
                            <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${
                              review.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                              review.status === 'approved' ? 'bg-green-50 text-green-600' :
                              'bg-red-50 text-red-500'
                            }`}>
                              {review.status}
                            </span>
                          </div>
                          <StarRating value={review.rating} readonly size={13} />
                          <p className="text-sm text-secondary/70 leading-relaxed font-light italic">
                            "{review.review}"
                          </p>
                          <p className="text-[10px] text-secondary/30 uppercase tracking-widest font-bold">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 lg:border-l border-black/5 pt-4 lg:pt-0 lg:pl-6 flex-shrink-0">
                        {review.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(review._id, 'approved')}
                            className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-green-600 hover:text-white transition-all w-full justify-center"
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(review._id, 'rejected')}
                            className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-amber-600 hover:text-white transition-all w-full justify-center"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all w-full flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ ADD REVIEW ══════════════════════ */}
        {activeView === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="max-w-2xl mx-auto bg-white rounded-[2rem] border border-black/5 shadow-sm p-10 md:p-14">
              <div className="mb-10">
                <h2 className="text-2xl font-heading mb-2">Add a Review</h2>
                <p className="text-secondary/50 text-sm font-light">
                  Manually add a client review. It will be published immediately as approved.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-12 gap-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle size={28} className="text-green-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl mb-2">Review Added!</h3>
                      <p className="text-secondary/50 text-sm font-light">The review is now live on the public site.</p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', review: '', rating: 0 }); }}
                      className="text-[10px] uppercase tracking-widest text-primary/50 hover:text-primary transition-colors underline underline-offset-4"
                    >
                      Add another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    {/* Name */}
                    <div>
                      <label className={labelClass}>Client Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Nair"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                      {formErrors.name && <p className="text-red-500/70 text-[10px] uppercase tracking-wider mt-1.5">{formErrors.name}</p>}
                    </div>

                    {/* Rating */}
                    <div>
                      <label className={labelClass}>Star Rating</label>
                      <div className="mt-1">
                        <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} size={28} />
                      </div>
                      {formErrors.rating && <p className="text-red-500/70 text-[10px] uppercase tracking-wider mt-1.5">{formErrors.rating}</p>}
                    </div>

                    {/* Review */}
                    <div>
                      <label className={labelClass}>Review Text</label>
                      <textarea
                        placeholder="Write the client's review..."
                        rows="5"
                        value={form.review}
                        onChange={(e) => setForm({ ...form, review: e.target.value })}
                        className={`${inputClass} resize-none`}
                      />
                      {formErrors.review && <p className="text-red-500/70 text-[10px] uppercase tracking-wider mt-1.5">{formErrors.review}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
                    >
                      <Send size={15} strokeWidth={2} />
                      {submitting ? 'Adding…' : 'Add Review'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ QR CODE ══════════════════════ */}
        {activeView === 'qr' && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-10 md:p-16">
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-3xl mx-auto">

                {/* QR Code */}
                <div className="flex-shrink-0 relative group">
                  <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-100/60 to-amber-50/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white border border-black/5 shadow-[0_8px_40px_rgba(0,0,0,0.10)] p-5 rounded-[2rem]">
                    <img
                      src={QR_SRC}
                      alt="QR code for reviews page"
                      width={200}
                      height={200}
                      className="rounded-xl"
                    />
                  </div>
                  {/* Corner accents */}
                  <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-amber-400/70 rounded-tl-lg" />
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-amber-400/70 rounded-tr-lg" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-amber-400/70 rounded-bl-lg" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-amber-400/70 rounded-br-lg" />
                </div>

                {/* Text + Download */}
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <QrCode size={15} className="text-primary/30" strokeWidth={1.5} />
                    <p className="text-[10px] uppercase tracking-[0.4em] text-primary/40 font-bold">Reviews QR Code</p>
                  </div>
                  <h2 className="text-3xl font-heading mb-4">
                    Share with your <span className="italic font-light">clients.</span>
                  </h2>
                  <p className="text-secondary/50 text-sm font-light leading-relaxed mb-8">
                    Clients scan this code to instantly open the reviews page on their phone.
                    Print it, display it at your studio, or share it on WhatsApp.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={QR_SRC}
                      download="ameer-photography-reviews-qr.png"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                    >
                      <Download size={14} strokeWidth={2} />
                      Download QR
                    </a>
                    <a
                      href={REVIEWS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-black/10 text-secondary/70 px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                    >
                      Open Reviews Page
                    </a>
                  </div>

                  <div className="mt-6 p-4 bg-light rounded-xl border border-black/5">
                    <p className="text-[9px] uppercase tracking-widest text-secondary/40 font-bold mb-1">Review Page URL</p>
                    <p className="text-xs text-secondary/60 font-mono break-all">{REVIEWS_URL}</p>
                  </div>

                  <p className="mt-4 text-[10px] text-secondary/30 leading-relaxed">
                    To update the URL for production, change <code className="bg-light px-1 py-0.5 rounded">NEXT_PUBLIC_SITE_URL</code> in <code className="bg-light px-1 py-0.5 rounded">client-next/.env</code>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ReviewManager;
