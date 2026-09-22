'use client';

import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function AdminHomepageManagerPage() {
  const [sections, setSections] = useState({
    featuredCategories: true,
    slider: true,
    promotedProducts: true,
    latestProducts: true,
    bannerSection: true,
    blogSlider: true,
    newsletter: true,
  });

  const [saved, setSaved] = useState(false);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h1 className="text-[22px] font-bold text-[#333333]">Homepage Manager</h1>
        <p className="text-[13px] text-[#777777]">Manage visibility and layout of sections on the storefront homepage</p>
      </div>

      {saved && (
        <div className="p-3 bg-[#e6f4ea] text-[#137333] rounded border border-[#ceead6] flex items-center gap-2 text-[13px] font-medium">
          <Check className="w-4 h-4 text-[#137333]" />
          <span>Homepage configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded border border-[#eaeaef] shadow-2xs p-5 space-y-4 text-[13.5px]">
        {[
          { key: 'slider', title: 'Main Hero Slider', desc: 'Display interactive hero banners at the top of the homepage' },
          { key: 'featuredCategories', title: 'Featured Categories', desc: 'Show round categories showcase grid' },
          { key: 'promotedProducts', title: 'Promoted / Special Products', desc: 'Highlight vendor boosted listings' },
          { key: 'latestProducts', title: 'Latest Products Grid', desc: 'Show newly added products catalog' },
          { key: 'bannerSection', title: 'Promotional Banners', desc: 'Display secondary image promo banners' },
          { key: 'blogSlider', title: 'Latest Blog Posts', desc: 'Show latest articles published on the platform' },
          { key: 'newsletter', title: 'Newsletter Subscription Box', desc: 'Allow visitors to subscribe to email updates' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#f1f3f5]">
            <div>
              <span className="font-semibold text-[#333333] block">{item.title}</span>
              <span className="text-[12px] text-[#777777]">{item.desc}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sections[item.key as keyof typeof sections]}
                onChange={() => toggleSection(item.key as keyof typeof sections)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a99d]"></div>
            </label>
          </div>
        ))}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[13.5px] flex items-center gap-2 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
