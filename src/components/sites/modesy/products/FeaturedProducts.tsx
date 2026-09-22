'use client';

import React, { useState } from 'react';
import { FEATURED_PRODUCTS } from '@/data/modesy-mock';
import { ProductCard } from './ProductCard';
import { ChevronDown, Loader2 } from 'lucide-react';

export function FeaturedProducts() {
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoading(false);
    }, 500);
  };

  const displayedProducts = FEATURED_PRODUCTS.slice(0, visibleCount);

  return (
    <section className="py-7 bg-white border-b border-[#f1f3f5]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#f1f3f5]">
          <h2 className="text-lg md:text-xl font-bold text-[#222222]">
            Featured Products
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < FEATURED_PRODUCTS.length + 6 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-[#dee2e6] hover:border-[#00a99d] bg-white text-[13px] font-semibold text-[#444444] hover:text-[#00a99d] transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
