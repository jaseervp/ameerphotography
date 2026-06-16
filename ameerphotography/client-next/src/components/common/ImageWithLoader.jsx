"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ImageWithLoader = ({ src, alt, className, wrapperClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName || 'w-full h-full'}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-primary/10 border-t-primary rounded-full"
          />
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-primary/40 font-medium">
            Loading
          </p>
        </div>
      )}
      <Image
        src={src}
        alt={alt || "Image"}
        fill
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;
