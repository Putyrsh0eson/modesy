'use client';

import React, { useState } from 'react';
import { useModesy } from '@/context/ModesyContext';
import { X, MapPin } from 'lucide-react';

const COUNTRIES = [
  { id: '1', name: 'United States' },
  { id: '2', name: 'Indonesia' },
  { id: '3', name: 'United Kingdom' },
  { id: '4', name: 'Germany' },
  { id: '5', name: 'Brazil' },
  { id: '6', name: 'France' },
  { id: '7', name: 'Canada' },
  { id: '8', name: 'Australia' },
];

export function LocationModal() {
  const { isLocationModalOpen, setLocationModalOpen } = useModesy();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [applied, setApplied] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setLocationModalOpen(false);
      setApplied(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => setLocationModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[420px] rounded-lg bg-white p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => setLocationModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-[#888888] hover:text-[#222222] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-[#00a99d]" />
          <h3 className="text-xl font-bold text-[#222222]">Select Location</h3>
        </div>
        <p className="text-xs text-[#888888] mb-6">Filter products by location</p>

        {applied ? (
          <div className="p-4 bg-[#e6f6f5] border border-[#00a99d] rounded text-center text-[#00a99d] text-sm font-semibold">
            Location applied successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#444444] mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full h-10 px-3 rounded border border-[#dee2e6] text-[14px] text-[#333333] focus:outline-none focus:border-[#00a99d] bg-white"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#444444] mb-1">
                State / Region
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State or Province"
                className="w-full h-10 px-3 rounded border border-[#dee2e6] text-[14px] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#444444] mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full h-10 px-3 rounded border border-[#dee2e6] text-[14px] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-full bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
            >
              Select Location
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
