"use client";
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from "next/navigation";

import BookingForm from "@/components/booking/BookingForm";

const ContactContent = () => {
  const searchParams = useSearchParams();
  const serviceParam = searchParams?.get('service');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header: Centered and Elegant */}
      <header className="text-center mb-24 md:mb-32">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.5em] text-primary/40 mb-6 font-semibold"
        >
          Connect With Us
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-8xl font-heading leading-tight mb-8"
        >
          Let&apos;s tell your <span className="italic font-light">story.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-secondary/50 tracking-[0.3em] uppercase text-[10px] md:text-xs"
        >
          Available for worldwide commissions & collaborations
        </motion.p>
      </header>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-none p-10 md:p-16 rounded-[2rem]">
          <div className="mb-12">
            <h4 className="text-2xl font-heading mb-2">Project Brief</h4>
            <p className="text-secondary/50 text-sm font-light">Tell us a little about your vision and what you&apos;re looking for.</p>
          </div>
          <BookingForm defaultService={serviceParam || ''} />
        </div>
      </div>

      {/* Bottom Detail: Subtle and Professional */}
      <footer className="mt-32 pt-16 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500/40 animate-pulse" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-secondary/40 font-medium">Currently accepting bookings for 2025</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary/30">
          &copy; 2024 Ameer Photography Studio. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 md:pt-48 pb-24 px-6 md:px-12 transition-colors duration-500 bg-base min-h-screen"
    >
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
        <ContactContent />
      </Suspense>
    </motion.div>
  );
};

export default Contact;
