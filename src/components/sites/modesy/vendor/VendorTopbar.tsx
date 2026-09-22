'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Eye, ChevronDown } from 'lucide-react';
import { ModesyUserDropdown } from '@/components/sites/modesy/header/ModesyUserDropdown';

interface VendorTopbarProps {
  onToggleSidebar: () => void;
}

export function VendorTopbar({ onToggleSidebar }: VendorTopbarProps) {
  return (
    <header className="min-h-16 bg-[#F7F8FC] border-b border-transparent flex items-center justify-between gap-3 px-3 sm:px-6 py-2 sticky top-0 z-30">
      {/* Left items */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded text-[#414456] hover:bg-white transition-colors"
        >
          <Menu className="w-5 h-5 text-[#333B53]" />
        </button>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* View Site Button (Green pill button like screenshot) */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-2 sm:px-4 py-1.5 bg-[#19bb9b] hover:bg-[#159e83] text-white text-xs font-semibold rounded-full shadow-sm transition-colors whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Site</span>
        </Link>

        {/* Language selector dropdown */}
        <div className="relative group flex items-center gap-1.5 text-xs text-[#333] font-medium cursor-pointer py-1 px-2 hover:bg-white rounded transition-colors">
          {/* US Flag SVG */}
          <span className="inline-block w-4 h-3 rounded-[1px] overflow-hidden shadow-xs border border-gray-200">
            <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
              <g fillRule="evenodd">
                <path fill="#bd3d44" d="M0 0h640v480H0z"/>
                <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203.1h640M0 277h640M0 350.8h640M0 424.6h640"/>
                <path fill="#192f5d" d="M0 0h256v258.5H0z"/>
                <circle cx="128" cy="129" r="80" fill="#fff" opacity="0.3"/>
              </g>
            </svg>
          </span>
          <span className="hidden sm:inline">English</span>
          <ChevronDown className="w-3 h-3 text-[#666]" />
        </div>

        {/* User Profile Avatar & Dropdown matching Modesy dropdown */}
        <ModesyUserDropdown avatarSize={28} />
      </div>
    </header>
  );
}
