'use client';

import React from 'react';

export default function AdminCustomFieldsPage() {
  const fields = [
    { id: 1, name: 'Color', type: 'checkbox', required: false, category: 'Clothing' },
    { id: 2, name: 'Size', type: 'dropdown', required: true, category: 'Clothing' },
    { id: 3, name: 'Material', type: 'text', required: false, category: 'Home & Living' },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Custom Fields</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
            <tr>
              <th className="py-2.5 px-3">Field Name</th>
              <th className="py-2.5 px-3">Field Type</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5]">
            {fields.map((f) => (
              <tr key={f.id}>
                <td className="py-2.5 px-3 font-semibold text-[#333333]">{f.name}</td>
                <td className="py-2.5 px-3 text-[#666666] uppercase text-[11px] font-mono">{f.type}</td>
                <td className="py-2.5 px-3 text-[#555555]">{f.category}</td>
                <td className="py-2.5 px-3">{f.required ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
