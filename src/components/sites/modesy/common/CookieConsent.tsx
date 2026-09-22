'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const consent = localStorage.getItem('modesy_cookie_consent');
      if (!consent) {
        setVisible(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('modesy_cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-white border border-[#dee2e6] rounded-lg shadow-2xl p-4 z-40 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[13px] text-[#444444] leading-relaxed">
          This site uses cookies. By continuing to browse the site, you are agreeing to our use of cookies.{' '}
          <Link href="/cookie-policy" className="text-[#00a99d] font-semibold underline">
            Cookie Policy
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-[#888888] hover:text-[#222222] p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={handleAccept}
          className="w-full py-2 px-4 rounded bg-[#00a99d] hover:bg-[#008e84] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
}
