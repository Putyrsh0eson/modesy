'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function AdminTagsPage() {
  const [tags, setTags] = useState([
    { id: 1, name: 'Summer Fashion', slug: 'summer-fashion', count: 18 },
    { id: 2, name: 'Handmade', slug: 'handmade', count: 9 },
    { id: 3, name: 'Vintage', slug: 'vintage', count: 14 },
    { id: 4, name: 'Accessories', slug: 'accessories', count: 25 },
  ]);
  const [tagName, setTagName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    setTags([...tags, { id: Date.now(), name: tagName, slug: tagName.toLowerCase().replace(/ /g, '-'), count: 0 }]);
    setTagName('');
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Product Tags</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <form onSubmit={handleAdd} className="md:col-span-4 bg-white rounded border border-[#eaeaef] p-4 space-y-3">
          <h2 className="font-bold text-[14px] text-[#333333]">Add Tag</h2>
          <input
            type="text"
            required
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Tag Name"
            className="w-full h-[36px] px-3 border border-[#dee2e6] rounded text-[13px] text-[#333333] focus:outline-none focus:border-[#00a99d]"
          />
          <button type="submit" className="w-full py-1.5 rounded bg-[#00a99d] text-white font-semibold text-[13px]">
            Add Tag
          </button>
        </form>

        <div className="md:col-span-8 bg-white rounded border border-[#eaeaef] p-4">
          <table className="w-full text-left text-[12.5px]">
            <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Slug</th>
                <th className="py-2.5 px-3">Usage</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {tags.map((t) => (
                <tr key={t.id}>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">{t.name}</td>
                  <td className="py-2.5 px-3 text-[#666666]">{t.slug}</td>
                  <td className="py-2.5 px-3 text-[#666666]">{t.count} items</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x.id !== t.id))}
                      className="p-1 text-[#dc3545]"
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
  );
}
