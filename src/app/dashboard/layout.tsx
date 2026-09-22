'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VendorSidebar } from '@/components/sites/modesy/vendor/VendorSidebar';
import { VendorTopbar } from '@/components/sites/modesy/vendor/VendorTopbar';
import { useModesy } from '@/context/ModesyContext';
import { Store } from 'lucide-react';

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isVendor } = useModesy();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Vendor Guard: Only Vendor and Admin can access Vendor Dashboard
  if (!isVendor) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-sm border border-amber-100">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Vendor Access Required</h1>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          You are currently signed in as <strong className="text-gray-700">{user?.username || 'Guest'}</strong> (Role: <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-700">{user?.role || 'Member'}</span>).
          To open your store and manage products or sales, sign in with a Vendor account.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded shadow-xs transition-colors"
          >
            Back to Marketplace
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-[#00a99d] hover:bg-[#008e84] text-white text-xs font-semibold rounded shadow-xs transition-colors"
          >
            Sign In with Vendor Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#414456] flex flex-col font-sans">
      {/* Vendor Sidebar */}
      <VendorSidebar
        isCollapsed={isSidebarCollapsed}
        onCloseMobile={() => setIsSidebarCollapsed(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <VendorTopbar
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 min-w-0 px-3 sm:px-5 lg:px-8 py-4 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
