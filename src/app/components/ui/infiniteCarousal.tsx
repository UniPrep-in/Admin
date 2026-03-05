'use client';
import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from 'framer-motion';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[]; // Array of image URLs
  speed?: number; // Pixels per second
}

export default function ImageCarousel({ images, speed = 120 }: ImageCarouselProps) {
  
  // Duplicate images for seamless loop
  const duplicatedImages = useMemo(() => [...images, ...images], [images]);

  const controls = useAnimation();

  const CARD_WIDTH = 240; // w-60 = 240px
  const GAP = 8; // gap-2 = 8px

  const startAnimation = () => {
    const distance = (CARD_WIDTH + GAP) * images.length;

    controls.start({
      x: [0, -distance],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: distance / speed,
        ease: "linear",
      },
    });
  };

  useEffect(() => {
    startAnimation();
  }, [images.length, speed]);

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => startAnimation()}
    >
      {/* Scrolling Container */}
      <motion.div
        className="flex gap-2 w-max"
        animate={controls}
        style={{ willChange: "transform" }}
      >
        {duplicatedImages.map((src, index) => (
          <div 
            key={index} 
            className="relative h-24 w-60 shrink-0 transition-all duration-300 hover:scale-110"
          >
            <Image
              src={src}
              alt={`Logo ${index}`}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}