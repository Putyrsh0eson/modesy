'use client';

import React, { useState } from 'react';
import { CreditCard, Check, Save } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [gateways, setGateways] = useState([
    { id: 'wallet', name: 'Wallet Balance', enabled: true },
    { id: 'stripe', name: 'Stripe Payment Gateway', enabled: true },
    { id: 'paypal', name: 'PayPal Express', enabled: true },
    { id: 'cod', name: 'Cash On Delivery (COD)', enabled: true },
    { id: 'bank', name: 'Bank Transfer / Wire', enabled: false },
  ]);

  const [saved, setSaved] = useState(false);

  const toggleGateway = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h1 className="text-xl sm:text-[22px] font-bold text-[#333333]">Payment Gateways</h1>

      {saved && (
        <div className="p-3 bg-[#e6f4ea] text-[#137333] rounded border border-[#ceead6] flex items-center gap-2 text-[13px] font-medium">
          <Check className="w-4 h-4 text-[#137333]" />
          <span>Payment gateways updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded border border-[#eaeaef] shadow-2xs p-3 sm:p-5 space-y-3">
        {gateways.map((g) => (
          <div key={g.id} className="flex items-center justify-between gap-3 py-3 border-b border-[#f1f3f5]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-[#f1f3f5] rounded text-[#555555]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[#333333] block break-words">{g.name}</span>
                <span className="text-[12px] text-[#777777] block">
                  {g.enabled ? 'Enabled and accepting payments' : 'Disabled'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={g.enabled}
                onChange={() => toggleGateway(g.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a99d]"></div>
            </label>
          </div>
        ))}

        <div className="pt-4 flex justify-stretch sm:justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto justify-center px-5 py-2 rounded bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[13px] flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Gateways</span>
          </button>
        </div>
      </form>
    </div>
  );
}
