'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([
    { id: 1, name: 'Nike', status: 'Active' },
    { id: 2, name: 'Adidas', status: 'Active' },
    { id: 3, name: 'Zara', status: 'Active' },
    { id: 4, name: 'Gucci', status: 'Active' },
  ]);
  const [name, setName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBrands([...brands, { id: Date.now(), name, status: 'Active' }]);
    setName('');
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Brands</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <form onSubmit={handleAdd} className="md:col-span-4 bg-white rounded border border-[#eaeaef] p-4 space-y-3">
          <h2 className="font-bold text-[14px] text-[#333333]">Add Brand</h2>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brand Name"
            className="w-full h-[36px] px-3 border border-[#dee2e6] rounded text-[13px] text-[#333333] focus:outline-none focus:border-[#00a99d]"
          />
          <button type="submit" className="w-full py-1.5 rounded bg-[#00a99d] text-white font-semibold text-[13px]">
            Save Brand
          </button>
        </form>

        <div className="md:col-span-8 bg-white rounded border border-[#eaeaef] p-4">
          <table className="w-full text-left text-[12.5px]">
            <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
              <tr>
                <th className="py-2.5 px-3">Brand Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {brands.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">{b.name}</td>
                  <td className="py-2.5 px-3 text-[#28a745] font-medium">{b.status}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setBrands(brands.filter((x) => x.id !== b.id))}
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
