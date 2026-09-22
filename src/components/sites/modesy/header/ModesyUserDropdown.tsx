'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModesy } from '@/context/ModesyContext';
import {
  Layers,
  LayoutDashboard,
  User,
  Wallet,
  ShoppingBag,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface ModesyUserDropdownProps {
  className?: string;
  avatarSize?: number;
}

export function ModesyUserDropdown({ className = '', avatarSize = 30 }: ModesyUserDropdownProps) {
  const router = useRouter();
  const { user, logout, hasAdminAccess, isVendor, setLoginModalOpen } = useModesy();
  const displayName = user?.role === 'moderator' ? 'Moderator' : user?.username;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => setLoginModalOpen(true)}
        className="text-xs font-semibold text-[#444444] hover:text-[#00a99d] transition-colors cursor-pointer"
      >
        Sign In / Register
      </button>
    );
  }

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/login');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-gray-100/60 transition-colors cursor-pointer select-none text-left"
        aria-expanded={isOpen}
      >
        <div
          className="rounded-full overflow-hidden shrink-0 relative p-[2px] bg-gradient-to-tr from-[#26d9ff] to-[#7076ff] shadow-xs"
          style={{ width: avatarSize, height: avatarSize }}
        >
          <Image
            src={user.avatar || '/images/user.png'}
            alt={user.username}
            fill
            sizes={`${avatarSize}px`}
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-[13px] font-semibold text-[#203145] tracking-tight">
          {displayName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#6c757d]" />
      </button>

      {/* Dropdown Menu (Pixel-perfect matching screenshot) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#eef0f3] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50 py-1.5 text-[13.5px] text-[#414456] animate-in fade-in duration-100">
          {/* Admin Panel (ONLY for Admin & Moderator) */}
          {hasAdminAccess && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
            >
              <Layers className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Dashboard (Vendor Dashboard for Vendor & Admin) */}
          {isVendor && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
            >
              <LayoutDashboard className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Profile */}
          <Link
            href={`/profile/${user.slug}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
          >
            <User className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
            <span>Profile</span>
          </Link>

          {/* Wallet */}
          <Link
            href="/wallet"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
          >
            <Wallet className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
            <span>Wallet</span>
          </Link>

          {/* Orders */}
          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
          >
            <ShoppingBag className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
            <span>Orders</span>
          </Link>

          {/* My Coupons */}
          <Link
            href="/my-coupons"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
          >
            <Tag className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
            <span>My Coupons</span>
          </Link>

          {/* Messages */}
          <Link
            href="/messages"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
          >
            <MessageSquare className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
            <span>Messages</span>
          </Link>

          {/* Profile Settings */}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] hover:text-[#00a99d] transition-colors group"
          >
            <Settings className="w-4 h-4 text-[#555555] group-hover:text-[#00a99d] transition-colors" />
            <span>Profile Settings</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8FC] text-left hover:text-rose-600 transition-colors group cursor-pointer border-t border-gray-100 mt-1"
          >
            <LogOut className="w-4 h-4 text-[#555555] group-hover:text-rose-600 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
