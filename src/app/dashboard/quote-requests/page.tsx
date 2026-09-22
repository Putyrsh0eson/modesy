'use client';

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface QuoteRequest {
  id: number;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  proposedPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function VendorQuoteRequestsPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([
    {
      id: 1,
      productTitle: 'Floral Print Summer Dress',
      buyerName: 'Peter Jone',
      buyerEmail: 'peter.jone@example.com',
      quantity: 10,
      proposedPrice: 28.00,
      status: 'pending',
      createdAt: '2026-09-10'
    },
    {
      id: 2,
      productTitle: 'Men Slim Fit Denim Jacket',
      buyerName: 'Alice Watson',
      buyerEmail: 'alice.w@example.com',
      quantity: 5,
      proposedPrice: 48.00,
      status: 'accepted',
      createdAt: '2026-09-08'
    }
  ]);

  const handleAction = (id: number, status: 'accepted' | 'rejected') => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Quote Requests (Bidding)</h1>
        <p className="text-xs text-gray-500 mt-0.5">Custom bulk price quotes submitted by customers</p>
      </div>

      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-[#e6e8eb] text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Quote ID</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Proposed Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8eb]">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">#QR-{q.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{q.productTitle}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{q.buyerName}</p>
                    <p className="text-[11px] text-gray-400">{q.buyerEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{q.quantity} pcs</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">${q.proposedPrice.toFixed(2)}/pc</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        q.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {q.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAction(q.id, 'accepted')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Accept
                        </button>
                        <button
                          onClick={() => handleAction(q.id, 'rejected')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
