'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModesy } from '@/context/ModesyContext';
import { Search, ShoppingBag, Heart } from 'lucide-react';

export function MainHeader() {
  const router = useRouter();
  const { cartCount, wishlistIds, user, isVendor } = useModesy();
  const sellNowHref = user?.role === 'admin' || isVendor ? '/dashboard/add-product' : '/sell-on-modesy';
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="hidden lg:block bg-white py-3.5 border-b border-[#f1f3f5]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <Image
              src="/sites/modesy/logo.svg"
              alt="Modesy"
              width={160}
              height={56}
              priority
              className="h-[46px] w-auto"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[620px]">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products, categories or brands"
              className="w-full h-[42px] pl-4 pr-12 rounded-full border border-[#dee2e6] bg-[#fdfdfd] text-[13.5px] text-[#333333] placeholder-[#888888] focus:outline-none focus:border-[#00a99d] transition-colors"
            />
            <button
              type="submit"
              aria-label="search"
              className="absolute right-1 top-1 w-8.5 h-8.5 rounded-full bg-[#00a99d] text-white flex items-center justify-center hover:bg-[#008e84] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 text-[#333333] hover:text-[#00a99d] transition-colors group"
          >
            <div className="relative">
              <ShoppingBag className="w-5.5 h-5.5 text-[#444444] group-hover:text-[#00a99d] transition-colors" />
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#00a99d] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="text-[13.5px] font-medium">Cart</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="flex items-center gap-2 text-[#333333] hover:text-[#00a99d] transition-colors group"
          >
            <div className="relative">
              <Heart className="w-5.5 h-5.5 text-[#444444] group-hover:text-[#00a99d] transition-colors" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </div>
            <span className="text-[13.5px] font-medium">Wishlist</span>
          </Link>

          {/* Sell Now Button */}
          <Link
            href={sellNowHref}
            className="h-[38px] px-5 rounded-full bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[13.5px] flex items-center justify-center transition-colors shadow-xs"
          >
            Sell Now
          </Link>
        </div>
      </div>
    </div>
  );
}
