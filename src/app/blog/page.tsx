'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fashion Trends', 'Tech & Gadgets', 'Marketplace Tips'];

  const posts = [
    {
      id: 1,
      title: 'Top 10 Fashion Trends You Need To Try This Season',
      slug: 'top-10-fashion-trends-this-season',
      category: 'Fashion Trends',
      summary: 'Discover the hottest apparel and streetwear styles taking over this year, from vintage silhouettes to vibrant pastel palettes.',
      image: '/sites/modesy/banner-clothing.jpg',
      author: 'Modesy Editorial',
      date: 'September 12, 2026',
      views: 1420
    },
    {
      id: 2,
      title: 'How to Start Your Online Multi-Vendor Store on Modesy',
      slug: 'how-to-start-online-store',
      category: 'Marketplace Tips',
      summary: 'A step-by-step guide to onboarding your products, setting up shipping policies, and reaching thousands of eager shoppers.',
      image: '/sites/modesy/banner-shoes.jpg',
      author: 'Admin Team',
      date: 'September 08, 2026',
      views: 2890
    },
    {
      id: 3,
      title: 'Next-Gen Audio: Wireless Earbuds and Noise Cancellation',
      slug: 'next-gen-audio-wireless-earbuds',
      category: 'Tech & Gadgets',
      summary: 'A deep dive into low-latency Bluetooth codecs and how audiophiles can find great fidelity without breaking the bank.',
      image: '/sites/modesy/banner-electronics.jpg',
      author: 'Tech Reviewer',
      date: 'September 02, 2026',
      views: 980
    }
  ];

  const filtered = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Blog</span>
      </nav>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Modesy Marketplace Blog</h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Insights, vendor tips, style guides, and tech highlights curated for our community.
        </p>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#222d32] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(post => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#222d32] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">By {post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
