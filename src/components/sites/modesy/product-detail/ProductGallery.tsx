'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const allImages = images.length > 0 ? images : ['/sites/modesy/prod-sundress-1.webp'];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prevImage = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="product-slider-wrapper flex flex-col-reverse sm:flex-row items-start gap-4 w-full">
      {/* Thumbnails Strip (Left side on desktop matching Modesy) */}
      {allImages.length > 1 && (
        <div className="thumb-slider-wrapper flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto w-full sm:w-[68px] sm:max-h-[520px] flex-shrink-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`w-[65px] h-[65px] flex-shrink-0 rounded-[4px] overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-[#00a99d] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="65px"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="slider-for-container relative flex-1 min-w-0 border border-[#eaeaef] rounded-[6px] overflow-hidden aspect-square w-full bg-[#fcfcfc] group">
        <Image
          src={allImages[selectedIndex] || allImages[0]}
          alt={title}
          fill
          priority
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 600px"
        />

        {/* Previous & Next Navigation Buttons */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#222222] flex items-center justify-center shadow-md transition-all z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#222222] flex items-center justify-center shadow-md transition-all z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
