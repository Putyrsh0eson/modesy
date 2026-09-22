'use client';

import React from 'react';
import { Banknote } from 'lucide-react';

export default function VendorCashOnDeliveryPage() {
  return (
    <div className="space-y-6 text-[#414456]">
      <div className="bg-white p-5 rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#333B53]">Cash on Delivery</h1>
          <p className="text-xs text-gray-500 mt-1">Manage orders paid via Cash on Delivery</p>
        </div>
      </div>

      <div className="bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] p-12 text-center">
        <Banknote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-gray-700">No Cash on Delivery orders</h3>
        <p className="text-xs text-gray-400 mt-1">Orders placed with Cash on Delivery will appear here.</p>
      </div>
    </div>
  );
}
