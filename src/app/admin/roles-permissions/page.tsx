'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminRolesPermissionsPage() {
  const roles = [
    { id: 1, name: 'Super Admin', isDefault: true, description: 'Has full access to all admin panel settings and controls' },
    { id: 2, name: 'Vendor', isDefault: true, description: 'Can manage own store products, view sales, and request payouts' },
    { id: 3, name: 'Member', isDefault: true, description: 'Standard buyer account with wishlist and shopping cart' },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#333333]">Roles & Permissions</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#dee2e6] bg-[#fafafa]">
            <tr>
              <th className="py-2.5 px-3">Role Name</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f5]">
            {roles.map((r) => (
              <tr key={r.id}>
                <td className="py-2.5 px-3 font-semibold text-[#333333] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00a99d]" />
                  <span>{r.name}</span>
                </td>
                <td className="py-2.5 px-3 text-[#666666]">{r.description}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#e8f0fe] text-[#1967d2]">
                    System Default
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
