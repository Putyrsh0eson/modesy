'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModesy } from '@/context/ModesyContext';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

export function MobileHeader() {
  const router = useRouter();
  const { cartCount, setMobileDrawerOpen } = useModesy();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="lg:hidden bg-white border-b border-[#e9ecef] sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="open-mobile-menu"
          className="p-1 text-[#333333] hover:text-[#00a99d] transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Centered Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/sites/modesy/logo.svg"
            alt="Modesy"
            width={130}
            height={48}
            priority
            className="h-[38px] w-auto"
          />
        </Link>

        {/* Right Icons (Search & Cart) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="toggle-mobile-search"
            className="p-1 text-[#333333] hover:text-[#00a99d] transition-colors cursor-pointer"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          <Link href="/cart" className="relative p-1 text-[#333333] hover:text-[#00a99d] transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 bg-[#00a99d] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="px-4 pb-3 border-t border-[#f1f3f5] bg-[#fafafa] pt-2">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories or brands"
              className="w-full h-10 pl-3 pr-10 rounded-full border border-[#dee2e6] bg-white text-[13px] text-[#333333] focus:outline-none focus:border-[#00a99d]"
            />
            <button
              type="submit"
              aria-label="search"
              className="absolute right-1 top-1 w-8 h-8 rounded-full bg-[#00a99d] text-white flex items-center justify-center hover:bg-[#008e84]"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
