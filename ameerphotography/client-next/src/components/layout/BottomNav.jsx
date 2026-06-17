"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { Home, Camera, Grid, Mail, Info, Star } from 'lucide-react';

const BottomNav = () => {
  const pathname = usePathname();

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/portfolio', icon: Camera, label: 'Gallery' },
    { to: '/services', icon: Grid, label: 'Services' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
    { to: '/contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <>
      {/* Mobile Header - Logo only */}
      <div className="md:hidden fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-6 py-5 pointer-events-none mix-blend-difference">
        <Link href="/" className="pointer-events-auto text-lg font-heading tracking-widest text-white hover:opacity-80 transition-opacity">
          AMEER PHOTOGRAPHY
        </Link>
      </div>

      <div className="md:hidden fixed bottom-6 left-0 w-full z-50 flex justify-center pointer-events-none px-4">
        <motion.nav 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex items-center justify-around w-full max-w-[440px] rounded-full p-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 h-[64px]"
        >
          {navLinks.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                href={to}
                className="relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-colors duration-300 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_2px_14px_rgba(0,0,0,0.18)] dark:shadow-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {!isActive && (
                  <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <div className={`relative z-10 flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-on-primary' : 'text-primary/50 group-hover:text-primary'}`}>
                  <Icon size={isActive ? 19 : 18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[8px] mt-[2px] tracking-[0.05em] uppercase font-bold">{label}</span>
                </div>
              </Link>
            );
          })}
        </motion.nav>
      </div>
    </>
  );
};

export default BottomNav;
