'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MEGA_MENU_CATEGORIES } from '@/data/modesy-mock';
import { ChevronDown } from 'lucide-react';

export function MegaMenu() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | number | null>(null);

  return (
    <div className="hidden lg:block bg-white border-b border-[#e9ecef] relative z-40">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4 relative">
        <nav className="flex items-center gap-0.5 font-sans flex-nowrap">
          {MEGA_MENU_CATEGORIES.map((cat) => {
            const hasFlyout = cat.subcategories.length > 0 || cat.images.length > 0;
            const isHovered = activeCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                className="shrink-0"
                onMouseEnter={() => setActiveCategoryId(cat.id)}
                onMouseLeave={() => setActiveCategoryId(null)}
              >
                <Link
                  href={`/${cat.slug}`}
                  className={`flex items-center gap-1 py-2.5 px-2 xl:px-2.5 text-[12px] xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    isHovered
                      ? 'text-[#00a99d] border-[#00a99d]'
                      : 'text-[#222222] border-transparent hover:text-[#00a99d]'
                  }`}
                >
                  <span className="whitespace-nowrap">{cat.name}</span>
                  {hasFlyout && <ChevronDown className="w-3 h-3 text-[#888888] shrink-0" />}
                </Link>

                {/* Mega Menu Dropdown Flyout - Anchored to the container so it NEVER overflows */}
                {hasFlyout && isHovered && (
                  <div className="absolute left-0 right-0 top-full w-full bg-white border border-[#e9ecef] shadow-xl rounded-b-md p-6 z-50 animate-in fade-in duration-100">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Subcategories */}
                      <div className={cat.images.length > 0 ? 'col-span-8' : 'col-span-12'}>
                        <div className={`grid gap-6 ${cat.images.length > 0 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                          {cat.subcategories.map((sub, idx) => (
                            <div key={idx} className="space-y-2">
                              <Link
                                href={`/${cat.slug}/${sub.slug}`}
                                className="font-bold text-[13.5px] text-[#222222] hover:text-[#00a99d] transition-colors block pb-1 border-b border-[#f1f3f5]"
                              >
                                {sub.name}
                              </Link>
                              {sub.items.length > 0 && (
                                <ul className="space-y-1.5 pt-1">
                                  {sub.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                      <Link
                                        href={`/${sub.slug}/${item.slug}`}
                                        className="text-[13px] text-[#666666] hover:text-[#00a99d] transition-colors block"
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Featured Images */}
                      {cat.images.length > 0 && (
                        <div className="col-span-4 border-l border-[#f1f3f5] pl-6 space-y-3">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#888888] block">
                            Featured
                          </span>
                          <div className="grid grid-cols-2 gap-3">
                            {cat.images.map((img, imgIdx) => (
                              <Link
                                key={imgIdx}
                                href={`/${cat.slug}/${img.slug}`}
                                className="group/card block rounded-md overflow-hidden border border-[#e9ecef] hover:border-[#00a99d] transition-all bg-[#fafafa]"
                              >
                                <div className="aspect-square relative overflow-hidden">
                                  <Image
                                    src={img.image}
                                    alt={img.name}
                                    fill
                                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                                    sizes="150px"
                                  />
                                </div>
                                <div className="p-2 text-center text-[12px] font-medium text-[#444444] group-hover/card:text-[#00a99d] truncate">
                                  {img.name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
