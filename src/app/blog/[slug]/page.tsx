'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, Tag } from 'lucide-react';

export default function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);

  const post = {
    title: resolvedParams.slug ? resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Fashion Trends',
    category: 'Fashion Trends',
    date: 'September 12, 2026',
    views: 1420,
    author: 'Modesy Editorial',
    image: '/sites/modesy/banner-clothing.jpg',
    tags: ['Fashion', 'Summer 2026', 'Streetwear', 'Style Guide'],
    content: `
      As temperatures rise, the summer wardrobe transforms into an effortless blend of comfort, vivid pastel palettes, and expressive accessories. In this comprehensive guide, we review the standout looks featured across top runways and independent designer collections.

      ### 1. Breathable Linen and Cotton Blends
      Natural fibers continue to dominate warm-weather aesthetics. Light earthy hues like sage green, sandy beige, and crisp ecru reflect heat while providing a relaxed, tailored look suited for both weekend brunch and weekday meetings.

      ### 2. Retro Denim Revival
      Denim jackets with 90s vintage washes and relaxed cuts are returning in a major way. Pair an oversized jacket over a floral sundress or tailored shorts for an effortlessly balanced silhouette.

      ### 3. Bold Statement Accessories
      Minimalist clothing invites expressive accent pieces. Statement sunglasses, chunky platform slides, and handcrafted woven totes offer instant elevation to any classic look.

      ### 4. Supporting Independent Makers
      Shopping directly from verified boutique vendors on Modesy ensures unique, sustainable pieces that stand out from fast fashion mass manufacturing.
    `
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-gray-900">Blog</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold truncate max-w-[200px]">{post.title}</span>
      </nav>

      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header Info */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4">
              <span>By <strong className="text-gray-800">{post.author}</strong></span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views} views</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="h-72 sm:h-96 relative rounded-lg overflow-hidden bg-gray-100">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>

        {/* Markdown Content */}
        <div className="text-sm text-gray-700 leading-relaxed space-y-4 pt-2">
          {post.content.split('\n\n').map((para, idx) => {
            if (para.trim().startsWith('### ')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-gray-900 pt-4">
                  {para.replace('### ', '')}
                </h3>
              );
            }
            return <p key={idx}>{para.trim()}</p>;
          })}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          {post.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
