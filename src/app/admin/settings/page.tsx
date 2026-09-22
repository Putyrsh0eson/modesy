'use client';

import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState('Modesy');
  const [appTitle, setAppTitle] = useState('Modesy - Marketplace and Classified Ads Script');
  const [commissionRate, setCommissionRate] = useState('10');
  const [currency, setCurrency] = useState('USD');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">General Settings</h1>
      </div>

      {saved && (
        <div className="p-3 bg-[#e6f4ea] text-[#137333] rounded border border-[#ceead6] flex items-center gap-2 text-[13px] font-medium animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#137333]" />
          <span>Settings have been updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded border border-[#eaeaef] shadow-2xs p-5 space-y-4 text-[13px]">
        <div>
          <label className="block font-semibold text-[#333333] mb-1">Application Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full max-w-md h-[38px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#333333] mb-1">Site Title</label>
          <input
            type="text"
            value={appTitle}
            onChange={(e) => setAppTitle(e.target.value)}
            className="w-full max-w-xl h-[38px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#333333] mb-1">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-[38px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="IDR">IDR (Rp)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#333333] mb-1">Admin Commission Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full h-[38px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[#f1f3f5]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-4 h-4 text-[#00a99d] rounded border-gray-300 focus:ring-[#00a99d]"
            />
            <div>
              <span className="font-semibold text-[#333333] block">Maintenance Mode</span>
              <span className="text-[12px] text-[#777777]">Temporarily disable storefront access for visitors</span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-[#f1f3f5] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[13.5px] flex items-center gap-2 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
