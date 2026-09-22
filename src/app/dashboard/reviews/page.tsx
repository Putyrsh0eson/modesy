'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { marketplaceStore } from '@/services/marketplaceStore';

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState(() => marketplaceStore.getReviews());

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setReviews(marketplaceStore.getReviews());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Customer Reviews</h1>
        <p className="text-xs text-gray-500 mt-0.5">Reviews and ratings left by buyers on your products</p>
      </div>

      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#e6e8eb]">
          {reviews.map(r => (
            <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-gray-800">{r.authorName}</span>
                  <span className="text-[11px] text-gray-400">• on {r.productTitle}</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-gray-700 ml-1.5">{r.rating}.0</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{r.comment}</p>
              </div>
              <span className="text-[11px] text-gray-400 shrink-0">{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
