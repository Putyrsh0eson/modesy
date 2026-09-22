'use client';

import React, { useState } from 'react';
import { ADMIN_USERS } from '@/data/admin-mock';
import { AdminUserItem } from '@/types/admin';
import { Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>(ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleBan = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Banned' : 'Active' } : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">Users & Membership</h1>
      </div>

      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f5]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search username, email, role..."
            className="h-[34px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[13px] text-[#333333] placeholder-[#999999] focus:outline-none focus:border-[#00a99d] w-[260px]"
          />
          <div className="text-[12.5px] text-[#777777]">
            Total Users: <span className="font-bold text-[#333333]">{users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#dee2e6] text-[#333333] font-semibold bg-[#fafafa]">
                <th className="py-2.5 px-3">Id</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Join Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3 text-[#777777]">{u.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333] flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00a99d]/10 text-[#00a99d] flex items-center justify-center font-bold text-xs">
                      {u.username.charAt(0)}
                    </div>
                    <span>{u.username}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#555555]">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.role === 'Super Admin'
                          ? 'bg-[#e8f0fe] text-[#1967d2]'
                          : u.role === 'Vendor'
                          ? 'bg-[#fef7e0] text-[#b06000]'
                          : 'bg-[#f1f3f4] text-[#5f6368]'
                      }`}
                    >
                      {u.role === 'Super Admin' && <Shield className="w-3 h-3" />}
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#333333]">${u.balance.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.status === 'Active'
                          ? 'bg-[#e6f4ea] text-[#137333]'
                          : 'bg-[#fce8e6] text-[#c5221f]'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#555555]">{u.joinDate}</td>
                  <td className="py-2.5 px-3 text-right">
                    {u.role !== 'Super Admin' && (
                      <button
                        type="button"
                        onClick={() => handleToggleBan(u.id)}
                        className={`px-2 py-1 rounded text-[11.5px] font-medium transition-colors ${
                          u.status === 'Active'
                            ? 'bg-[#fff5f5] text-[#dc3545] hover:bg-[#ffe3e3]'
                            : 'bg-[#f0fdf4] text-[#16a34a] hover:bg-[#dcfce7]'
                        }`}
                      >
                        {u.status === 'Active' ? 'Ban User' : 'Unban'}
                      </button>
                    )}
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
