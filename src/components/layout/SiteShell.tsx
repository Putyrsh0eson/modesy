'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/sites/modesy/header/Header';
import { Footer } from '@/components/sites/modesy/footer/Footer';
import { LoginModal } from '@/components/sites/modesy/modals/LoginModal';
import { LocationModal } from '@/components/sites/modesy/modals/LocationModal';
import { AddToCartModal } from '@/components/sites/modesy/modals/AddToCartModal';
import { CookieConsent } from '@/components/sites/modesy/common/CookieConsent';
import { ScrollToTop } from '@/components/sites/modesy/common/ScrollToTop';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/invoice');

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Global Header & Navigation */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Controls */}
      <LoginModal />
      <LocationModal />
      <AddToCartModal />
      <CookieConsent />
      <ScrollToTop />
    </>
  );
}
