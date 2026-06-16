"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { ArrowRight, ChevronDown } from 'lucide-react';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=2000'
];

const FireHero = ({ photos = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use photos from database if available, otherwise use default high quality images
  const slides = photos.length > 0 ? photos.map(p => p.url) : DEFAULT_IMAGES;

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const title = "AMEER PHOTOGRAPHY";

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @keyframes letterBlur {
          0%   { opacity: 0; filter: blur(18px); transform: scale(1.15) translateY(8px); }
          40%  { opacity: 0.8; filter: blur(5px);  transform: scale(1.04) translateY(2px); }
          100% { opacity: 1; filter: blur(0px);  transform: scale(1) translateY(0); }
        }
        @keyframes kenBurns {
          0%   { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>

      {/* Fullscreen Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide]}
              alt="Cinematic wedding photography backdrop"
              className="w-full h-full object-cover"
              style={{
                animation: 'kenBurns 6.5s ease-out forwards'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-black/35 z-10 pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-30 flex flex-col items-center text-white text-center max-w-4xl px-6">
        
        {/* Subtle top subheadline */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[10px] uppercase tracking-[0.6em] font-semibold text-white/80 mb-6"
        >
          FINE ART WEDDING & PORTRAIT IMAGERY
        </motion.p>

        {/* Brand Main Title (Letters Reveal) */}
        <h1 className="flex flex-wrap justify-center gap-x-2 md:gap-x-4 text-5xl sm:text-6xl md:text-8xl font-schnyder tracking-widest text-white leading-none">
          {title.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} className="inline-flex">
              {word.split('').map((char, charIndex) => {
                const totalIndex = wordIndex * 6 + charIndex; // Approximate for delay mapping
                return (
                  <span
                    key={charIndex}
                    className="inline-block"
                    style={{
                      animation: `letterBlur 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                      animationDelay: `${0.8 + totalIndex * 0.08}s`,
                      opacity: 0
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Dynamic decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 2.2 }}
          className="w-24 md:w-40 h-[1.5px] bg-white/40 my-8 origin-center"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
          className="font-body font-light tracking-[0.3em] text-sm md:text-xl text-white/80 mb-12 uppercase"
        >
          Every Frame. Every Feeling.
        </motion.p>

        {/* Explore Portfolio CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.2 }}
        >
          <Link href="/portfolio"
            className="group inline-flex items-center gap-4 bg-white hover:bg-transparent text-black hover:text-white border border-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 shadow-2xl hover:shadow-none"
          >
            Explore Portfolio
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute bottom-10 z-30 flex flex-col items-center cursor-pointer"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-white/60 mb-2">Discover</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-white/60" />
        </motion.div>
      </motion.div>

      {/* Elegant fade transition to the next section */}
      
    </div>
  );
};

export default FireHero;
