'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { marketplaceStore } from '@/services/marketplaceStore';

export default function VendorCommentsPage() {
  const [comments, setComments] = useState(() => marketplaceStore.getComments());

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setComments(marketplaceStore.getComments());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6 text-[#414456]">
      <div className="bg-white p-5 rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#333B53]">Comments</h1>
          <p className="text-xs text-gray-500 mt-1">Manage customer comments left on your products</p>
        </div>
      </div>

      <div className="bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] overflow-hidden">
        {comments.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">No comments found</h3>
            <p className="text-xs text-gray-400 mt-1">When buyers comment on your products, they will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#eef0f3] text-[#333B53] font-semibold text-[12px]">
                <th className="py-3 px-4">Id</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5] text-[12px]">
              {comments.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-semibold text-gray-800">{c.id}</td>
                  <td className="py-3 px-4 text-gray-700">{c.authorName}</td>
                  <td className="py-3 px-4 text-gray-600">{c.comment}</td>
                  <td className="py-3 px-4 font-medium text-emerald-600">
                    <Link href={`/${c.productSlug}`} className="hover:underline">
                      {c.productTitle}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
