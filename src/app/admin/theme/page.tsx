'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function AdminThemePage() {
  const [menuLimit, setMenuLimit] = useState(8);
  const [navTemplate, setNavTemplate] = useState('1');
  const [feaCategoriesDesign, setFeaCategoriesDesign] = useState('grid_layout');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-[22px] font-bold text-[#333333]">Theme Settings</h1>
      </div>

      {saved && (
        <div className="p-3 bg-[#e6f4ea] text-[#137333] rounded border border-[#ceead6] flex items-center gap-2 text-[13px] font-medium">
          <Check className="w-4 h-4 text-[#137333]" />
          <span>Theme settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Navigation Box */}
        <div className="bg-white rounded border border-[#eaeaef] shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-[#f1f3f5] bg-[#fafafa]">
            <h2 className="font-bold text-[14.5px] text-[#333333]">Navigation Options</h2>
          </div>
          <div className="p-4 space-y-4 text-[13px]">
            <div>
              <label className="block font-semibold text-[#333333] mb-1">
                Menu Limit (Number of links in menu)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={menuLimit}
                onChange={(e) => setMenuLimit(Number(e.target.value))}
                className="w-48 h-[36px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#333333] mb-2">Navigation Template</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded border cursor-pointer block transition-colors ${
                  navTemplate === '1' ? 'border-[#00a99d] bg-[#f0fdfa]' : 'border-[#dee2e6] bg-white'
                }`}>
                  <input
                    type="radio"
                    name="nav"
                    value="1"
                    checked={navTemplate === '1'}
                    onChange={() => setNavTemplate('1')}
                    className="mr-2"
                  />
                  <span className="font-semibold text-[#333333]">Navigation 1 (Mega Menu)</span>
                  <div className="mt-2 h-12 bg-[#fafafa] border border-dashed border-[#dee2e6] rounded flex items-center justify-center text-xs text-[#888888]">
                    Full Mega Menu Dropdown
                  </div>
                </label>

                <label className={`p-3 rounded border cursor-pointer block transition-colors ${
                  navTemplate === '2' ? 'border-[#00a99d] bg-[#f0fdfa]' : 'border-[#dee2e6] bg-white'
                }`}>
                  <input
                    type="radio"
                    name="nav"
                    value="2"
                    checked={navTemplate === '2'}
                    onChange={() => setNavTemplate('2')}
                    className="mr-2"
                  />
                  <span className="font-semibold text-[#333333]">Navigation 2 (Classic)</span>
                  <div className="mt-2 h-12 bg-[#fafafa] border border-dashed border-[#dee2e6] rounded flex items-center justify-center text-xs text-[#888888]">
                    Compact Standard Dropdown
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="p-3 bg-[#fafafa] border-t border-[#f1f3f5] text-right">
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#00a99d] text-white font-semibold text-[12.5px] hover:bg-[#008e84] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Featured Categories Box */}
        <div className="bg-white rounded border border-[#eaeaef] shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-[#f1f3f5] bg-[#fafafa]">
            <h2 className="font-bold text-[14.5px] text-[#333333]">Featured Categories Design</h2>
          </div>
          <div className="p-4 space-y-4 text-[13px]">
            <div className="grid grid-cols-2 gap-3">
              <label className={`p-3 rounded border cursor-pointer block transition-colors ${
                feaCategoriesDesign === 'grid_layout' ? 'border-[#00a99d] bg-[#f0fdfa]' : 'border-[#dee2e6] bg-white'
              }`}>
                <input
                  type="radio"
                  name="cat_design"
                  value="grid_layout"
                  checked={feaCategoriesDesign === 'grid_layout'}
                  onChange={() => setFeaCategoriesDesign('grid_layout')}
                  className="mr-2"
                />
                <span className="font-semibold text-[#333333]">Grid Layout</span>
                <div className="mt-2 h-12 bg-[#fafafa] border border-dashed border-[#dee2e6] rounded flex items-center justify-center text-xs text-[#888888]">
                  Circular Category Grid
                </div>
              </label>

              <label className={`p-3 rounded border cursor-pointer block transition-colors ${
                feaCategoriesDesign === 'slider_layout' ? 'border-[#00a99d] bg-[#f0fdfa]' : 'border-[#dee2e6] bg-white'
              }`}>
                <input
                  type="radio"
                  name="cat_design"
                  value="slider_layout"
                  checked={feaCategoriesDesign === 'slider_layout'}
                  onChange={() => setFeaCategoriesDesign('slider_layout')}
                  className="mr-2"
                />
                <span className="font-semibold text-[#333333]">Slider Layout</span>
                <div className="mt-2 h-12 bg-[#fafafa] border border-dashed border-[#dee2e6] rounded flex items-center justify-center text-xs text-[#888888]">
                  Horizontal Swiper Carousel
                </div>
              </label>
            </div>
          </div>
          <div className="p-3 bg-[#fafafa] border-t border-[#f1f3f5] text-right">
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#00a99d] text-white font-semibold text-[12.5px] hover:bg-[#008e84] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
