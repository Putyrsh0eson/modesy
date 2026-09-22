'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export default function AdminRefundRequestsPage() {
  const refunds = [
    { id: 1, orderNumber: '#10012', buyer: 'Sarah Connor', reason: 'Item received was not as described', amount: 45.00, status: 'Pending', date: '2026-09-08' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold text-[#333333]">Refund Requests</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] min-w-[650px]">
            <thead className="border-b border-[#dee2e6] text-[#555555] bg-[#fafafa]">
              <tr>
                <th className="py-2.5 px-3">Id</th>
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Buyer</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {refunds.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3 text-[#777777]">{r.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#00a99d]">{r.orderNumber}</td>
                  <td className="py-2.5 px-3 font-medium text-[#333333]">{r.buyer}</td>
                  <td className="py-2.5 px-3 text-[#555555] max-w-xs">{r.reason}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">${r.amount.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#fef7e0] text-[#b06000]">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => alert('Refund approved!')}
                        className="p-1 rounded bg-[#e6f4ea] text-[#137333] hover:bg-[#ceead6]"
                        title="Approve Refund"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Refund rejected!')}
                        className="p-1 rounded bg-[#fce8e6] text-[#c5221f] hover:bg-[#fad2cf]"
                        title="Reject Refund"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
