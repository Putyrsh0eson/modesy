'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/sites/modesy/admin/AdminSidebar';
import { AdminTopbar } from '@/components/sites/modesy/admin/AdminTopbar';
import { useModesy } from '@/context/ModesyContext';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasAdminAccess } = useModesy();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Role Guard: Only Admin and Moderator can access the Admin Panel
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 shadow-sm border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Admin Panel Access Restricted</h1>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          You are currently logged in as <strong className="text-gray-700">{user?.username || 'Guest'}</strong> (Role: <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-700">{user?.role || 'Guest'}</span>).
          This panel is restricted to Administrator and Moderator accounts.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded shadow-xs transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-[#00a99d] hover:bg-[#008e84] text-white text-xs font-semibold rounded shadow-xs transition-colors"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#333333] font-sans antialiased flex">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-[260px]' : 'lg:pl-0'
        }`}
      >
        <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 min-w-0 p-3 sm:p-6 overflow-x-hidden">
          {children}
        </main>

        <footer className="border-t border-[#e7ebf0] bg-[#f4f6f9] text-[#7a8599] text-[11px] px-3 sm:px-6 py-2.5 flex flex-wrap gap-x-4 gap-y-1 items-center justify-between">
          <div>Copyright 2025 Modesy - All Rights Reserved.</div>
          <div>Version 2.7</div>
        </footer>
      </div>
    </div>
  );
}
