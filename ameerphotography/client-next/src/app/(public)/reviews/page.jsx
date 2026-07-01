"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Star, Send, CheckCircle } from 'lucide-react';
import api from "@/lib/api";

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? 'button' : 'button'}
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={readonly ? 16 : 28}
            strokeWidth={1.5}
            className={`transition-colors duration-200 ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-primary/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group flex flex-col p-8 md:p-10 border border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#1A1A1A] rounded-[2.5rem] transition-all duration-700 hover:border-primary/20 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#222] hover:shadow-2xl hover:shadow-black/5"
  >
    {/* Review Text */}
    <p className="font-heading text-base md:text-lg leading-relaxed text-primary/80 dark:text-white/80 mb-6 font-light flex-grow">
      "{review.review}"
    </p>

    {/* User Profile & Stars */}
    <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5 mt-auto">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-light dark:bg-white/5 flex-shrink-0 border border-black/5 dark:border-white/10 flex items-center justify-center">
          {review.image ? (
            <img 
              src={review.image} 
              alt={review.name} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
            />
          ) : (
            <span className="text-lg font-heading text-primary/30 dark:text-white/30 uppercase">
              {(review.name || 'A')[0]}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <h4 className="font-heading text-sm text-primary dark:text-white tracking-wide">
            {review.name}
          </h4>
          <p className="text-[9px] text-secondary/30 uppercase tracking-[0.1em] mt-0.5">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
          </p>
        </div>
      </div>

      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={10} 
            className={`${i < (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-black/5 dark:text-white/5'}`} 
          />
        ))}
      </div>
    </div>
  </motion.article>
);

const Reviews = () => {
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', review: '', rating: 0 });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/approved');
      setApprovedReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Your name is required';
    if (!form.review.trim()) newErrors.review = 'Please write a review';
    if (form.rating === 0) newErrors.rating = 'Please select a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', form);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = 'block text-[10px] uppercase tracking-[0.15em] font-medium text-black/50 mb-2 ml-1';
  const inputClass = 'w-full bg-transparent border-b border-black/10 pb-3 pt-1 focus:outline-none focus:border-black/50 transition-colors duration-300 text-black placeholder:text-black/30 font-light text-base rounded-none';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 md:pt-48 pb-24 px-6 md:px-12 min-h-screen bg-base transition-colors duration-500"
    >
      

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center mb-24 md:mb-32">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.5em] text-primary/40 mb-6 font-semibold"
          >
            Client Stories
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-8xl font-heading leading-tight mb-8"
          >
            What they <span className="italic font-light">say.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-secondary/50 tracking-[0.3em] uppercase text-[10px] md:text-xs"
          >
            Memories captured. Stories told. Hearts touched.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* LEFT: Submit Review Form */}
          <div>
            <div className="bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-10 md:p-14 rounded-[2rem]">
              
              <div className="mb-12">
                <h2 className="text-2xl font-heading mb-2">Share Your Experience</h2>
                <p className="text-secondary/50 text-sm font-light">
                  Your words inspire us. Reviews are approved before being published.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 gap-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle size={28} className="text-green-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl mb-2">Thank You!</h3>
                      <p className="text-secondary/50 text-sm font-light">
                        Your review has been submitted and is pending approval. We appreciate your kind words!
                      </p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', review: '', rating: 0 }); }}
                      className="text-[10px] uppercase tracking-widest text-primary/50 hover:text-primary transition-colors underline underline-offset-4"
                    >
                      Submit another review
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    {/* Name */}
                    <div>
                      <label className={labelClass}>Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Nair"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                      {errors.name && <p className="text-red-500/60 text-[10px] uppercase tracking-wider mt-2">{errors.name}</p>}
                    </div>

                    {/* Rating */}
                    <div>
                      <label className={labelClass}>Your Rating</label>
                      <div className="py-2">
                        <StarRating
                          value={form.rating}
                          onChange={(val) => setForm({ ...form, rating: val })}
                        />
                      </div>
                      {errors.rating && <p className="text-red-500/60 text-[10px] uppercase tracking-wider mt-2">{errors.rating}</p>}
                    </div>

                    {/* Review */}
                    <div>
                      <label className={labelClass}>Your Review</label>
                      <textarea
                        placeholder="Tell us about your experience with Ameer Photography..."
                        rows="4"
                        value={form.review}
                        onChange={(e) => setForm({ ...form, review: e.target.value })}
                        className={`${inputClass} resize-none`}
                      />
                      {errors.review && <p className="text-red-500/60 text-[10px] uppercase tracking-wider mt-2">{errors.review}</p>}
                    </div>

                    {errors.submit && (
                      <p className="text-red-500/60 text-[10px] uppercase tracking-wider">{errors.submit}</p>
                    )}

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="group relative w-full md:w-auto inline-flex items-center justify-center gap-4 bg-[#111111] text-white px-16 py-5 rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl disabled:opacity-50"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
                        <span className="relative z-10 tracking-[0.25em] uppercase text-[11px] font-bold">
                          {submitting ? 'Submitting…' : 'Submit Review'}
                        </span>
                        <Send size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Approved Reviews */}
          <div>
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-heading">Client Reviews</h2>
              {approvedReviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-light text-secondary/60">
                    {(approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length).toFixed(1)} avg
                  </span>
                </div>
              )}
            </div>

            {loadingReviews ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : approvedReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <Star size={32} className="text-primary/10 mb-4" strokeWidth={1} />
                <p className="text-[10px] uppercase tracking-widest text-secondary/40">
                  Be the first to share your experience
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6 max-h-[720px] overflow-y-auto pr-2 custom-scrollbar">
                {approvedReviews.map((review, i) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reviews;
