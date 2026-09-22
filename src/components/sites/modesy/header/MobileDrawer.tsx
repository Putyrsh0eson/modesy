'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModesy } from '@/context/ModesyContext';
import { MEGA_MENU_CATEGORIES, CURRENCIES, LANGUAGES } from '@/data/modesy-mock';
import { X, ChevronRight, MapPin, ChevronDown } from 'lucide-react';

export function MobileDrawer() {
  const {
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    currency,
    setCurrency,
    language,
    setLanguage,
    setLocationModalOpen,
    setLoginModalOpen,
    user,
    isVendor,
    logout,
  } = useModesy();
  const sellNowHref = user?.role === 'admin' || isVendor ? '/dashboard/add-product' : '/sell-on-modesy';

  const [activeTab, setActiveTab] = useState<'main' | 'categories'>('main');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  if (!isMobileDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => setMobileDrawerOpen(false)}
      />

      {/* Drawer Body */}
      <div className="fixed top-0 bottom-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        {/* Header / Close button */}
        <div className="p-4 flex items-center justify-between border-b border-[#e9ecef]">
          <Image
            src="/sites/modesy/logo.svg"
            alt="Modesy"
            width={120}
            height={44}
            className="h-8 w-auto"
          />
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 text-[#666666] hover:text-[#222222]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sell Now Action */}
        <div className="p-4 border-b border-[#f1f3f5]">
          <Link
            href={sellNowHref}
            onClick={() => setMobileDrawerOpen(false)}
            className="block w-full py-2.5 rounded-full bg-[#00a99d] text-white font-medium text-[14px] text-center shadow-xs"
          >
            Sell Now
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e9ecef] bg-[#f8f9fa]">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-3 text-[13px] font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'main'
                ? 'border-[#00a99d] text-[#00a99d] bg-white'
                : 'border-transparent text-[#666666]'
            }`}
          >
            Main Menu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-3 text-[13px] font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-[#00a99d] text-[#00a99d] bg-white'
                : 'border-transparent text-[#666666]'
            }`}
          >
            Categories
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 text-[14px]">
          {activeTab === 'main' ? (
            <div className="space-y-3 text-[#333333]">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="block py-2 border-b border-[#f1f3f5] font-medium"
              >
                Home
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileDrawerOpen(false)}
                className="block py-2 border-b border-[#f1f3f5]"
              >
                Wishlist
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileDrawerOpen(false)}
                className="block py-2 border-b border-[#f1f3f5]"
              >
                Contact
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileDrawerOpen(false)}
                className="block py-2 border-b border-[#f1f3f5]"
              >
                Blog
              </Link>
              <Link
                href={sellNowHref}
                onClick={() => setMobileDrawerOpen(false)}
                className="block py-2 border-b border-[#f1f3f5]"
              >
                Sell on Modesy
              </Link>

              {/* Location */}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setLocationModalOpen(true);
                }}
                className="w-full text-left py-2 border-b border-[#f1f3f5] flex items-center gap-2 text-[#444444]"
              >
                <MapPin className="w-4 h-4 text-[#00a99d]" />
                <span>Location</span>
              </button>

              {/* Auth links matching Modesy _nav_mobile.php */}
              {user ? (
                <div className="pt-2 space-y-2 border-b border-[#f1f3f5] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-[#dee2e6]">
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-[#333333] block">{user.username}</span>
                      <span className="text-[10.5px] uppercase font-semibold text-[#00a99d]">{user.role}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[12px]">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="py-1 px-2 rounded bg-gray-50 text-[#333333] font-medium hover:text-[#00a99d]"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {(user.role === 'admin' || user.role === 'vendor') && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="py-1 px-2 rounded bg-gray-50 text-[#333333] font-medium hover:text-[#00a99d]"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href={`/profile/${user.slug}`}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="py-1 px-2 rounded bg-gray-50 text-[#333333] font-medium hover:text-[#00a99d]"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="py-1 px-2 rounded bg-gray-50 text-[#333333] font-medium hover:text-[#00a99d]"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="py-1 px-2 rounded bg-gray-50 text-[#333333] font-medium hover:text-[#00a99d]"
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        logout();
                      }}
                      className="py-1 px-2 rounded bg-red-50 text-[#e02424] font-medium text-left cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="text-[#00a99d] font-semibold cursor-pointer"
                  >
                    Login
                  </button>
                  <span className="text-[#cccccc]">|</span>
                  <Link
                    href="/register"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-[#444444] font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Language & Currency Selectors */}
              <div className="pt-4 mt-4 border-t border-[#e9ecef] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#888888]">Currency</span>
                  <select
                    value={currency.code}
                    onChange={(e) => {
                      const found = CURRENCIES.find((c) => c.code === e.target.value);
                      if (found) setCurrency(found);
                    }}
                    className="text-[13px] border border-[#dee2e6] rounded px-2 py-1 bg-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#888888]">Language</span>
                  <select
                    value={language.code}
                    onChange={(e) => {
                      const found = LANGUAGES.find((l) => l.code === e.target.value);
                      if (found) setLanguage(found);
                    }}
                    className="text-[13px] border border-[#dee2e6] rounded px-2 py-1 bg-white"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Categories Tab */
            <div className="space-y-1">
              {MEGA_MENU_CATEGORIES.map((cat) => {
                const isOpen = activeSubcategory === cat.slug;
                return (
                  <div key={cat.id} className="border-b border-[#f1f3f5]">
                    <div className="flex items-center justify-between py-2.5">
                      <Link
                        href={`/${cat.slug}`}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="text-[14px] font-medium text-[#222222] hover:text-[#00a99d]"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSubcategory(isOpen ? null : cat.slug)
                          }
                          className="p-1 text-[#888888]"
                        >
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-[#00a99d]" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {isOpen && cat.subcategories.length > 0 && (
                      <div className="pl-3 pb-2 space-y-2 bg-[#fafafa] rounded p-2 mb-2">
                        {cat.subcategories.map((sub, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            <Link
                              href={`/${cat.slug}/${sub.slug}`}
                              onClick={() => setMobileDrawerOpen(false)}
                              className="text-[13px] font-semibold text-[#444444] block"
                            >
                              {sub.name}
                            </Link>
                            {sub.items.map((it, itIdx) => (
                              <Link
                                key={itIdx}
                                href={`/${sub.slug}/${it.slug}`}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="block pl-2 text-[12px] text-[#666666] hover:text-[#00a99d]"
                              >
                                {it.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
