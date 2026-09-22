'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HERO_SLIDES } from '@/data/modesy-mock';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminSliderPage() {
  const [slides, setSlides] = useState(HERO_SLIDES);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSlide = {
      id: Date.now(),
      title,
      description,
      buttonText: 'Shop Now',
      buttonLink: link || '/products',
      image: '/sites/modesy/slider-1.webp',
    };
    setSlides([...slides, newSlide]);
    setTitle('');
    setDescription('');
    setLink('');
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this slider item?')) {
      setSlides(slides.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">Slider Items</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Slider Form */}
        <div className="lg:col-span-5 bg-white rounded border border-[#eaeaef] shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-[#f1f3f5] bg-[#fafafa]">
            <h2 className="font-bold text-[14.5px] text-[#333333]">Add Slider Item</h2>
          </div>
          <form onSubmit={handleAddSlide} className="p-4 space-y-3 text-[13px]">
            <div>
              <label className="block font-semibold text-[#333333] mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Trendy Summer Essentials"
                className="w-full h-[36px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#333333] mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief slide description..."
                className="w-full p-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#333333] mb-1">Target Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /clothing"
                className="w-full h-[36px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 rounded bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slider Item</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sliders Table */}
        <div className="lg:col-span-7 bg-white rounded border border-[#eaeaef] shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-[#f1f3f5] bg-[#fafafa]">
            <h2 className="font-bold text-[14.5px] text-[#333333]">Active Slides ({slides.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="border-b border-[#dee2e6] text-[#555555]">
                <tr>
                  <th className="py-2.5 px-3">Image</th>
                  <th className="py-2.5 px-3">Title & Link</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f5]">
                {slides.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f8f9fa]">
                    <td className="py-2.5 px-3">
                      <div className="w-24 h-14 relative rounded overflow-hidden border border-[#dee2e6] bg-[#f8f9fa]">
                        <Image src={s.image} alt={s.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#333333]">{s.title}</div>
                      <div className="text-[11px] text-[#00a99d] truncate max-w-xs">{s.buttonLink}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="p-1 rounded bg-[#f1f3f5] hover:bg-[#fee2e2] text-[#dc3545] transition-colors"
                        title="Delete slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
