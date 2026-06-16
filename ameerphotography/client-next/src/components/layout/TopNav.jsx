"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { motion } from 'framer-motion';

const TopNav = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="hidden md:flex fixed top-0 left-0 w-full z-50 justify-center px-6 pointer-events-none pt-6">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full max-w-[1400px]"
      >
        <div className="flex items-center justify-between w-full rounded-full p-1.5 pl-8 bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500">

          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-schnyder tracking-widest text-primary hover:opacity-80 transition-opacity">
            AMEER PHOTOGRAPHY
          </Link>

          {/* Right Side: Links and Toggle */}
          <div className="flex items-center">
            {/* Navigation Links */}
            <nav className="flex items-center px-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="relative px-5 py-2.5 rounded-full text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-bold transition-colors duration-300 group"
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="topnav-active-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-[0_2px_14px_rgba(0,0,0,0.18)] dark:shadow-none"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Hover effect when not active */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}

                    <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-on-primary' : 'text-primary/60 group-hover:text-primary'}`}>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default TopNav;
