'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HERO_SLIDES } from '@/data/modesy-mock';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#222222] group">
      {/* Slider container */}
      <div className="relative h-[300px] sm:h-[380px] md:h-[460px] lg:h-[500px] w-full">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center"
                sizes="100vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              {/* Caption Content aligned with 80% container */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
                  <div className="max-w-[560px] text-white space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-white/90 drop-shadow">
                      {slide.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={slide.buttonLink}
                        className="inline-block px-7 py-2.5 rounded bg-[#222222] hover:bg-[#00a99d] text-white font-semibold text-sm md:text-base transition-colors shadow-md"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#00a99d] text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#00a99d] text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSlide(i)}
            aria-label={`go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === i ? 'w-7 bg-[#00a99d]' : 'bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
