'use client';

import React from 'react';

export default function AdminQuoteRequestsPage() {
  const quotes = [
    { id: 1, product: 'Black fashion women backpack', buyer: 'Admin', seller: 'Trendshop', price: 60.00, status: 'Completed', date: '2026-09-02' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold text-[#333333]">Quote Requests</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] min-w-[650px]">
            <thead className="border-b border-[#dee2e6] text-[#555555] bg-[#fafafa]">
              <tr>
                <th className="py-2.5 px-3">Id</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Buyer</th>
                <th className="py-2.5 px-3">Seller</th>
                <th className="py-2.5 px-3">Offered Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3 text-[#777777]">{q.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">{q.product}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{q.buyer}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{q.seller}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#00a99d]">${q.price.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#e6f4ea] text-[#137333]">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#777777]">{q.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
