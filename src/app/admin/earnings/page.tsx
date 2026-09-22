'use client';

import React, { useState, useEffect } from 'react';
import { marketplaceStore } from '@/services/marketplaceStore';
import { AdminEarning } from '@/types/admin';
import { DollarSign, Percent, Wallet } from 'lucide-react';

const mapStoreEarnings = (): AdminEarning[] => {
  return marketplaceStore.getOrders().map((o, idx) => {
    const saleAmount = typeof o.total === 'number' ? o.total : parseFloat(String(o.total)) || 0;
    const adminCommission = parseFloat((saleAmount * 0.1).toFixed(2));
    const vendorEarning = parseFloat((saleAmount * 0.9).toFixed(2));
    const vendorName = o.items[0]?.sellerName || 'Trendshop';
    return {
      id: Number(o.id) || idx + 1,
      orderNumber: o.orderNumber,
      vendorName,
      saleAmount,
      adminCommission,
      vendorEarning,
      date: o.createdAt || '2026-09-14'
    };
  });
};

export default function AdminEarningsPage() {
  const [earnings, setEarnings] = useState<AdminEarning[]>([]);

  useEffect(() => {
    const sync = () => {
      setEarnings(mapStoreEarnings());
    };
    sync();
    return marketplaceStore.subscribe(sync);
  }, []);

  const totalSales = earnings.reduce((acc, curr) => acc + curr.saleAmount, 0);
  const totalCommission = earnings.reduce((acc, curr) => acc + curr.adminCommission, 0);
  const totalVendorEarnings = earnings.reduce((acc, curr) => acc + curr.vendorEarning, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">Earnings & Commissions</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded border border-[#eaeaef] p-4 flex items-center gap-3">
          <div className="p-3 bg-[#e8f0fe] rounded text-[#1967d2]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#333333]">${totalSales.toFixed(2)}</div>
            <div className="text-[12px] text-[#777777]">Total Gross Sales</div>
          </div>
        </div>

        <div className="bg-white rounded border border-[#eaeaef] p-4 flex items-center gap-3">
          <div className="p-3 bg-[#e6f4ea] rounded text-[#137333]">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#28a745]">${totalCommission.toFixed(2)}</div>
            <div className="text-[12px] text-[#777777]">Admin Commission (10%)</div>
          </div>
        </div>

        <div className="bg-white rounded border border-[#eaeaef] p-4 flex items-center gap-3">
          <div className="p-3 bg-[#fef7e0] rounded text-[#b06000]">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#333333]">${totalVendorEarnings.toFixed(2)}</div>
            <div className="text-[12px] text-[#777777]">Vendor Total Earnings</div>
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <h2 className="font-bold text-[15px] text-[#333333] mb-3">Recent Sales Commissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#dee2e6] text-[#333333] font-semibold bg-[#fafafa]">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Vendor</th>
                <th className="py-2.5 px-3">Sale Total</th>
                <th className="py-2.5 px-3">Admin Fee (10%)</th>
                <th className="py-2.5 px-3">Vendor Net</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {earnings.map((e) => (
                <tr key={e.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3 font-semibold text-[#00a99d]">{e.orderNumber}</td>
                  <td className="py-2.5 px-3 font-medium text-[#333333]">{e.vendorName}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">${e.saleAmount.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#28a745]">+${e.adminCommission.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-[#555555]">${e.vendorEarning.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-[#777777]">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
