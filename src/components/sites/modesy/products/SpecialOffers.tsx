'use client';

import React, { useRef } from 'react';
import { SPECIAL_OFFERS } from '@/data/modesy-mock';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SpecialOffers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-7 bg-white border-b border-[#f1f3f5]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#f1f3f5]">
          <h2 className="text-lg md:text-xl font-bold text-[#222222]">
            Special Offers
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous offers"
              className="w-7.5 h-7.5 rounded-full border border-[#dee2e6] hover:border-[#00a99d] hover:bg-[#00a99d] hover:text-white text-[#555555] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Next offers"
              className="w-7.5 h-7.5 rounded-full border border-[#dee2e6] hover:border-[#00a99d] hover:bg-[#00a99d] hover:text-white text-[#555555] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SPECIAL_OFFERS.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[160px] sm:w-[185px] md:w-[205px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
