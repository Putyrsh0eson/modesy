'use client';

import React from 'react';
import { Flag } from 'lucide-react';

export default function VendorRefundRequestsPage() {
  return (
    <div className="space-y-6 text-[#414456]">
      <div className="bg-white p-5 rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#333B53]">Refund Requests</h1>
          <p className="text-xs text-gray-500 mt-1">Manage refund requests requested by buyers</p>
        </div>
      </div>

      <div className="bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#eef0f3] text-[#333B53] font-semibold text-[12px]">
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5] text-[12px]">
            <tr className="hover:bg-gray-50/50">
              <td className="py-3 px-4 font-semibold text-gray-800">#10019</td>
              <td className="py-3 px-4">Vintage Leather Watch</td>
              <td className="py-3 px-4 font-medium text-emerald-600">$59.00</td>
              <td className="py-3 px-4">
                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                  Pending Seller Review
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500">2026-09-12 / 10:14</td>
              <td className="py-3 px-4 text-center">
                <button className="px-3 py-1 bg-[#17a2b8] hover:bg-[#138496] text-white text-[11px] font-medium rounded transition-colors">
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
