"use client";

import { useEffect } from 'react';
import { ReactLenis as Lenis } from 'lenis/react';
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }) {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <Lenis root options={{
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: () => window.innerWidth < 768,
    }}>
      <div className="flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-grow pb-[56px] md:pb-0 transition-colors duration-500">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Lenis>
  );
}
