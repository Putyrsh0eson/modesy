'use client';

import React, { useEffect, useState } from 'react';
import { vendorService, VendorEarning } from '@/services/vendorService';
import { marketplaceStore } from '@/services/marketplaceStore';

export default function VendorEarningsPage() {
  const [earnings, setEarnings] = useState<VendorEarning[]>([]);

  useEffect(() => {
    const fetchEarnings = () => {
      vendorService.getEarnings().then(setEarnings);
    };
    fetchEarnings();
    return marketplaceStore.subscribe(fetchEarnings);
  }, []);

  const totalGross = earnings.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalCommission = earnings.reduce((sum, e) => sum + e.commissionAmount, 0);
  const totalNet = earnings.reduce((sum, e) => sum + e.netEarning, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Earnings & Commissions</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track your net earnings after platform commission deductions</p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gross Sales</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">${totalGross.toFixed(2)}</h3>
          <span className="text-[11px] text-gray-500">Customer checkout total</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform Commission (10%)</p>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">-${totalCommission.toFixed(2)}</h3>
          <span className="text-[11px] text-gray-500">Modesy admin fee</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Net Earnings</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">${totalNet.toFixed(2)}</h3>
          <span className="text-[11px] text-gray-500">Credited to vendor balance</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e6e8eb]">
          <h2 className="text-sm font-bold text-gray-800">Earning Breakdown by Order</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-[#e6e8eb] text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Order Total</th>
                <th className="px-4 py-3">Commission Rate</th>
                <th className="px-4 py-3">Platform Fee</th>
                <th className="px-4 py-3 font-bold text-emerald-700">Net Earning</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8eb]">
              {earnings.map(earn => (
                <tr key={earn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">{earn.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">${earn.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{earn.commissionRate}%</td>
                  <td className="px-4 py-3 text-rose-600 font-medium">-${earn.commissionAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">${earn.netEarning.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-400">{earn.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
