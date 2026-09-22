'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { ALL_PRODUCTS } from '@/data/modesy-mock';
import { ArrowRight } from 'lucide-react';

export function NewArrivals() {
  const latestProducts = ALL_PRODUCTS.slice(0, 10);

  return (
    <section className="py-7 bg-white">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
        {/* Section Header matching Modesy .section-header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#f1f3f5] pb-3">
          <h2 className="text-[20px] sm:text-[21px] font-bold text-[#222222] tracking-tight">
            <Link href="/products" className="hover:text-[#00a99d] transition-colors">
              New Arrivals
            </Link>
          </h2>
          <Link
            href="/products"
            className="text-[13px] font-semibold text-[#555555] hover:text-[#00a99d] transition-colors flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-[#888888] group-hover:text-[#00a99d] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Product Grid matching Modesy row-product: 5 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {latestProducts.map((product) => (
            <div key={`new-arrival-${product.id}`} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
