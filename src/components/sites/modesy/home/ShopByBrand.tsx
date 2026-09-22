'use client';

import React from 'react';
import Link from 'next/link';

const BRANDS = [
  { id: 1, name: 'Nike', image: '/sites/modesy/banner-shoes.jpg' },
  { id: 2, name: 'Adidas', image: '/sites/modesy/banner-clothing.jpg' },
  { id: 3, name: 'Zara', image: '/sites/modesy/banner-electronics.jpg' },
  { id: 4, name: 'H&M', image: '/sites/modesy/banner-shoes.jpg' },
  { id: 5, name: 'Apple', image: '/sites/modesy/banner-clothing.jpg' },
  { id: 6, name: 'Sony', image: '/sites/modesy/banner-electronics.jpg' },
];

export function ShopByBrand() {
  return (
    <section className="py-6 w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
      <div className="flex items-center justify-between border-b border-[#eaeaef] pb-3 mb-4">
        <h3 className="text-[17px] font-bold text-[#222222]">
          Shop By Brand
        </h3>
        <Link
          href="/products"
          className="text-xs font-semibold text-[#00a99d] hover:underline"
        >
          View All Brands
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {BRANDS.map(brand => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.id}`}
            className="group bg-white border border-[#eaeaef] rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-[#00a99d] transition-all"
          >
            <div className="w-16 h-12 relative overflow-hidden flex items-center justify-center">
              <span className="font-extrabold text-sm text-[#444444] tracking-wider group-hover:text-[#00a99d] transition-colors">
                {brand.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
