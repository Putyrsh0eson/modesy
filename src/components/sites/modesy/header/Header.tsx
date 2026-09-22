'use client';

import React from 'react';
import { Topbar } from './Topbar';
import { MainHeader } from './MainHeader';
import { MegaMenu } from './MegaMenu';
import { MobileHeader } from './MobileHeader';
import { MobileDrawer } from './MobileDrawer';

export function Header() {
  return (
    <header id="header" className="w-full">
      <Topbar />
      <MainHeader />
      <MegaMenu />
      <MobileHeader />
      <MobileDrawer />
    </header>
  );
}
