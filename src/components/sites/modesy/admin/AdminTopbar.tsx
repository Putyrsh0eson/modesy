'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Eye, Globe, ChevronDown } from 'lucide-react';
import { ModesyUserDropdown } from '@/components/sites/modesy/header/ModesyUserDropdown';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: TopbarProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="min-h-[56px] bg-white border-b border-[#e7ebf0] flex items-center justify-between gap-3 px-3 sm:px-4 py-2 sticky top-0 z-40 select-none">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded text-[#555555] hover:text-[#222222] hover:bg-[#f1f3f5] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* View Site Button */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded bg-[#20c997] hover:bg-[#1bb386] text-white text-[12.5px] font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
        </Link>

        {/* Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 text-[12.5px] text-[#444444] hover:text-[#00a99d] transition-colors py-1"
          >
            <Globe className="w-3.5 h-3.5 text-[#777777]" />
            <span className="hidden sm:inline">English</span>
            <ChevronDown className="w-3 h-3 text-[#777777]" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white rounded border border-[#dee2e6] shadow-md py-1 z-50 animate-in fade-in duration-100 text-[12.5px]">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9fa] text-[#333333] font-medium"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9fa] text-[#666666]"
              >
                Arabic
              </button>
            </div>
          )}
        </div>

        {/* Admin User Profile Dropdown */}
        <ModesyUserDropdown avatarSize={28} />
      </div>
    </header>
  );
}
