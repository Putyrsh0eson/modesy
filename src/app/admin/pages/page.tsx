'use client';

import React from 'react';

export default function AdminPagesPage() {
  const pages = [
    { id: 1, title: 'About Us', slug: 'about-us', location: 'Footer' },
    { id: 2, title: 'Terms & Conditions', slug: 'terms-conditions', location: 'Footer' },
    { id: 3, title: 'Privacy Policy', slug: 'privacy-policy', location: 'Footer' },
    { id: 4, title: 'Contact', slug: 'contact', location: 'Top Navigation & Footer' },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Pages</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
            <tr>
              <th className="py-2.5 px-3">Title</th>
              <th className="py-2.5 px-3">Slug</th>
              <th className="py-2.5 px-3">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5]">
            {pages.map((p) => (
              <tr key={p.id}>
                <td className="py-2.5 px-3 font-semibold text-[#333333]">{p.title}</td>
                <td className="py-2.5 px-3 font-mono text-[#666666] text-[11.5px]">{p.slug}</td>
                <td className="py-2.5 px-3 text-[#555555]">{p.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
