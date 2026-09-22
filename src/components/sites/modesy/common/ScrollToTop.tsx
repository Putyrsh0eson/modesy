'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="scroll-to-top"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[#00a99d] hover:bg-[#008e84] text-white shadow-lg flex items-center justify-center transition-all animate-in fade-in duration-150 cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
