'use client';

import React from 'react';

export default function AdminBlogPage() {
  const posts = [
    { id: 1, title: 'Top 10 Trending Outfits for This Autumn', category: 'Fashion Tips', author: 'Admin', date: '2026-09-01' },
    { id: 2, title: 'How to Choose the Best Handmade Gifts', category: 'Lifestyle', author: 'Admin', date: '2026-08-20' },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Blog Posts</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
            <tr>
              <th className="py-2.5 px-3">Title</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Author</th>
              <th className="py-2.5 px-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5]">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="py-2.5 px-3 font-semibold text-[#333333]">{p.title}</td>
                <td className="py-2.5 px-3 text-[#555555]">{p.category}</td>
                <td className="py-2.5 px-3 text-[#555555] font-medium">{p.author}</td>
                <td className="py-2.5 px-3 text-right text-[#777777]">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
