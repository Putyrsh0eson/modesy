'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROMO_BANNERS_THREE_COL } from '@/data/modesy-mock';

export function PromoBannersThreeCol() {
  return (
    <section className="py-5 bg-[#f8f9fa]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {PROMO_BANNERS_THREE_COL.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="group block relative overflow-hidden rounded-md border border-[#e9ecef] shadow-xs hover:shadow-md transition-all"
            >
              <div className="relative aspect-[417/218] w-full bg-[#e9ecef]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
