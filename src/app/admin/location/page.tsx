'use client';

import React from 'react';

export default function AdminLocationPage() {
  const countries = [
    { id: 1, name: 'United States', code: 'US', status: 'Active' },
    { id: 2, name: 'United Kingdom', code: 'GB', status: 'Active' },
    { id: 3, name: 'Indonesia', code: 'ID', status: 'Active' },
    { id: 4, name: 'Germany', code: 'DE', status: 'Active' },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Location Settings (Countries)</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
            <tr>
              <th className="py-2.5 px-3">Country Name</th>
              <th className="py-2.5 px-3">ISO Code</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5]">
            {countries.map((c) => (
              <tr key={c.id}>
                <td className="py-2.5 px-3 font-semibold text-[#333333]">{c.name}</td>
                <td className="py-2.5 px-3 font-mono text-[#666666]">{c.code}</td>
                <td className="py-2.5 px-3 text-[#28a745] font-medium">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
