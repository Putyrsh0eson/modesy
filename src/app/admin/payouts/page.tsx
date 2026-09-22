'use client';

import React from 'react';


export default function AdminPayoutsPage() {
  const payouts = [
    { id: 1, vendor: 'Trendshop', amount: 350.00, method: 'Bank Transfer (IBAN)', status: 'Pending', date: '2026-09-10' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold text-[#333333]">Vendor Payout Requests</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
            <tr>
              <th className="py-2.5 px-3">Id</th>
              <th className="py-2.5 px-3">Vendor</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Payout Method</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5]">
            {payouts.map((p) => (
              <tr key={p.id}>
                <td className="py-2.5 px-3 text-[#777777]">{p.id}</td>
                <td className="py-2.5 px-3 font-semibold text-[#333333]">{p.vendor}</td>
                <td className="py-2.5 px-3 font-bold text-[#28a745]">${p.amount.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-[#555555]">{p.method}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#fef7e0] text-[#b06000]">
                    {p.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[#777777]">{p.date}</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => alert('Payout marked as completed!')}
                    className="px-2.5 py-1 rounded bg-[#00a99d] text-white text-[11.5px] font-medium hover:bg-[#008e84]"
                  >
                    Approve Payout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
