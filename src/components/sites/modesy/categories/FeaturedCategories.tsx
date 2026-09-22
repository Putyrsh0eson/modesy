'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FEATURED_CATEGORIES } from '@/data/modesy-mock';
import { ChevronRight } from 'lucide-react';

export function FeaturedCategories() {
  return (
    <section className="featured-categories py-6 bg-white border-b border-[#f1f3f5]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
        {/* Section Header matching Modesy */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#f1f3f5]">
          <h2 className="text-lg md:text-xl font-bold text-[#222222]">
            Featured Categories
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-0.5 text-xs font-semibold text-[#00a99d] hover:text-[#008e84] transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid matching Modesy .item-category-round */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 pt-3">
          {FEATURED_CATEGORIES.map((category) => (
            <div key={category.id} className="item-category-round text-center group">
              <Link href={`/products?category=${category.slug}`} className="block">
                {/* Round Category Image matching Modesy .category-image */}
                <div className="category-image relative aspect-square mx-auto max-w-[155px] rounded-full overflow-hidden bg-[#fafafa] border border-[#eaeaef] transition-all">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 30vw, 155px"
                  />
                </div>

                {/* Category Name matching Modesy .category-name */}
                <div className="category-name pt-3 text-center">
                  <span className="text-[14px] md:text-[15px] font-semibold text-[#222222] group-hover:text-[#00a99d] transition-colors line-clamp-1">
                    {category.name}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
