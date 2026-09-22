'use client';

import React, { useState } from 'react';
import { CheckCircle, Save } from 'lucide-react';

export default function VendorShippingSettingsPage() {
  const [flatRate, setFlatRate] = useState('5.00');
  const [estimatedDays, setEstimatedDays] = useState('3-5 business days');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('75.00');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Shipping Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Configure delivery charges, lead time, and free shipping threshold</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Shipping settings saved!
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Standard Flat Shipping Cost ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={flatRate}
              onChange={e => setFlatRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Estimated Delivery Time
            </label>
            <input
              type="text"
              value={estimatedDays}
              onChange={e => setEstimatedDays(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Free Shipping Over Order Amount ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={freeShippingThreshold}
              onChange={e => setFreeShippingThreshold(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-bold shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
