'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModesy } from '@/context/ModesyContext';
import { CURRENCIES, LANGUAGES } from '@/data/modesy-mock';
import {
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { ModesyUserDropdown } from './ModesyUserDropdown';

export function Topbar() {
  const {
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

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden lg:block border-b border-[#e9ecef] bg-white text-[12.5px] text-[#666666]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4 flex justify-between items-center h-[36px]">
        {/* Left Links */}
        <div className="flex items-center gap-6">
          <Link href="/contact" className="hover:text-[#00a99d] transition-colors">
            Contact
          </Link>
          <Link href={sellNowHref} className="hover:text-[#00a99d] transition-colors">
            Sell on Modesy
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-5">
          {/* Location button */}
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1 hover:text-[#00a99d] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#888888]" />
            <span>Location</span>
          </button>

          {/* Currency dropdown */}
          <div className="relative" ref={currencyRef}>
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1 hover:text-[#00a99d] transition-colors cursor-pointer"
            >
              <span>{currency.name}</span>
              <ChevronDown className="w-3 h-3 text-[#888888]" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#e9ecef] rounded shadow-lg z-50 py-1">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-[#f8f9fa] hover:text-[#00a99d] transition-colors flex items-center justify-between cursor-pointer ${
                      currency.code === c.code ? 'font-semibold text-[#00a99d]' : 'text-[#444444]'
                    }`}
                  >
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 hover:text-[#00a99d] transition-colors cursor-pointer"
            >
              <Image
                src={language.flag}
                alt={language.name}
                width={18}
                height={12}
                className="w-[18px] h-auto rounded-xs object-cover"
              />
              <span>{language.name}</span>
              <ChevronDown className="w-3 h-3 text-[#888888]" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#e9ecef] rounded shadow-lg z-50 py-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-[#f8f9fa] hover:text-[#00a99d] transition-colors flex items-center gap-2 cursor-pointer ${
                      language.code === l.code ? 'font-semibold text-[#00a99d]' : 'text-[#444444]'
                    }`}
                  >
                    <Image
                      src={l.flag}
                      alt={l.name}
                      width={18}
                      height={12}
                      className="w-[18px] h-auto rounded-xs object-cover"
                    />
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Auth Area matching Modesy _top_bar.php */}
          {user ? (
            <ModesyUserDropdown avatarSize={24} />
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="hover:text-[#00a99d] transition-colors cursor-pointer"
              >
                Login
              </button>
              <span className="text-[#cccccc]">/</span>
              <Link href="/register" className="hover:text-[#00a99d] transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
