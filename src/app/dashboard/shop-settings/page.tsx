'use client';

import React, { useState } from 'react';
import { CheckCircle, Save } from 'lucide-react';

export default function VendorShopSettingsPage() {
  const [shopName, setShopName] = useState('Trendshop Official Store');
  const [slug, setSlug] = useState('trendshop');
  const [description, setDescription] = useState('Premium lifestyle, apparel, and fashion accessories curated with love.');
  const [phone, setPhone] = useState('+1 234 567 890');
  const [facebook, setFacebook] = useState('https://facebook.com/trendshop');
  const [instagram, setInstagram] = useState('https://instagram.com/trendshop');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Shop Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Configure your public vendor storefront details and branding</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Shop settings saved successfully!
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shop Title / Brand Name
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shop URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-0.5 block">Store URL: /profile/{slug}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Shop Description / Bio
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={facebook}
                onChange={e => setFacebook(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-bold shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
