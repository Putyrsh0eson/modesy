'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

const RECENT_POSTS = [
  {
    id: 1,
    title: 'Top 10 Fashion Trends You Need To Try This Season',
    slug: 'top-10-fashion-trends-this-season',
    category: 'Fashion Trends',
    date: 'Sep 12, 2026',
    views: 1420,
    image: '/sites/modesy/banner-clothing.jpg',
  },
  {
    id: 2,
    title: 'How to Start Your Online Multi-Vendor Store on Modesy',
    slug: 'how-to-start-online-store',
    category: 'Marketplace Tips',
    date: 'Sep 08, 2026',
    views: 2890,
    image: '/sites/modesy/banner-shoes.jpg',
  },
  {
    id: 3,
    title: 'Next-Gen Audio: Wireless Earbuds and Noise Cancellation',
    slug: 'next-gen-audio-wireless-earbuds',
    category: 'Tech & Gadgets',
    date: 'Sep 02, 2026',
    views: 980,
    image: '/sites/modesy/banner-electronics.jpg',
  },
];

export function HomeBlogSection() {
  return (
    <section className="py-6 w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4">
      <div className="flex items-center justify-between border-b border-[#eaeaef] pb-3 mb-4">
        <h3 className="text-[17px] font-bold text-[#222222]">
          Latest Blog Posts
        </h3>
        <Link
          href="/blog"
          className="text-xs font-semibold text-[#00a99d] hover:underline inline-flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RECENT_POSTS.map(post => (
          <article
            key={post.id}
            className="group bg-white border border-[#eaeaef] rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-40 relative bg-gray-100 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#222d32] text-white text-[10px] font-bold rounded">
                {post.category}
              </span>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[11px] text-[#888888] mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#222222] group-hover:text-[#00a99d] line-clamp-2 leading-tight">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h4>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-[#00a99d] hover:underline"
                >
                  Read More &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
