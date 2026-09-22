'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useModesy } from '@/context/ModesyContext';
import {
  Home,
  Palette,
  Sliders,
  Layers,
  ShoppingCart,
  ShoppingBag,
  Flag,
  Package,
  Folder,
  Tag,
  Asterisk,
  SlidersHorizontal,
  CreditCard,
  Coins,
  Wallet,
  FileText,
  Newspaper,
  MapPin,
  Users,
  ShieldCheck,
  Settings,
  HelpCircle,
  Database,
  Wrench,
  Megaphone,
  MessageSquare,
  Send,
  Star,
  Mail,
  Link2,
  AlertTriangle,
  Ban,
  List,
  Download,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ isOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useModesy();
  const displayName = user?.username || 'Admin';

  // State to manage open/collapsed submenus
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    orders: pathname.includes('/admin/orders') || pathname.includes('/admin/transactions'),
    products: pathname.includes('/admin') && !pathname.includes('/admin/payments') && !pathname.includes('/admin/earnings') && !pathname.includes('/admin/payouts') && !pathname.includes('/admin/blog') && !pathname.includes('/admin/location') && !pathname.includes('/admin/users') && !pathname.includes('/admin/roles-permissions') && !pathname.includes('/admin/settings'),
    payments: pathname.includes('/admin/payments') || pathname.includes('/admin/earnings'),
    content: pathname.includes('/admin/pages') || pathname.includes('/admin/blog'),
    payouts: pathname.includes('/admin/payouts'),
    membership: pathname.includes('/admin/users') || pathname.includes('/admin/roles-permissions'),
    help: pathname.includes('/admin/help-center'),
    comments: pathname.includes('/admin/comments'),
    settings: pathname.includes('/admin/settings'),
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (window.innerWidth < 1024) onCloseMobile?.();
  }, [pathname, onCloseMobile]);

  const isLinkActive = (path: string) => pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#343b4a] text-[#b8c7ce] w-[260px] flex flex-col transition-transform duration-300 shadow-lg ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-[50px] bg-[#343b4a] flex items-center justify-center px-4 border-b border-[#3e4656] shrink-0">
        <Link href="/admin" className="flex items-center gap-1.5 text-white font-sans">
          <span className="text-[17px] font-bold tracking-tight">Modesy</span>
          <span className="text-[17px] font-normal text-gray-300">Panel</span>
        </Link>
      </div>

      {/* User Status Profile */}
      <div className="px-7 py-5 flex items-center gap-4 border-b border-[#3e4656] shrink-0 bg-[#343b4a]">
        <div className="w-[42px] h-[42px] rounded-full overflow-hidden relative border border-[#3b4c56] shrink-0 bg-[#34495e]">
          <Image
            src={user?.avatar || '/images/user.png'}
            alt={user?.username || 'Admin'}
            fill
            className="object-cover"
            onError={(e) => {
              // fallback if image not found
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[13.5px] font-bold text-white leading-tight">{displayName}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#00a65a]" />
            <span className="text-[11px] text-[#8aa4af]">Online</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 text-[13px] select-none font-sans">
        {/* NAVIGATION SECTION */}
        <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Navigation
        </div>

        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 text-[#8aa4af]" />
          <span>Home</span>
        </Link>

        <Link
          href="/admin/theme"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/theme')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4 text-[#8aa4af]" />
          <span>Theme</span>
        </Link>

        <Link
          href="/admin/slider"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/slider')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#8aa4af]" />
          <span>Slider</span>
        </Link>

        <Link
          href="/admin/homepage-manager"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/homepage-manager')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-[#8aa4af]" />
          <span>Homepage Manager</span>
        </Link>

        {/* ORDERS SECTION */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Orders
        </div>

        {/* Orders Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('orders')}
            className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors border-l-[3px] ${
              pathname.includes('/admin/orders') || pathname.includes('/admin/transactions')
                ? 'bg-[#1e282c] text-white border-[#00a99d]'
                : 'border-transparent hover:bg-[#1e282c] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-[#8aa4af]" />
              <span>Orders</span>
            </div>
            {openSections.orders ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />
            )}
          </button>

          {openSections.orders && (
            <div className="bg-[#2c3b41] py-1 text-[12.5px]">
              <Link
                href="/admin/orders"
                className={`block pl-10 pr-4 py-2 transition-colors ${
                  isLinkActive('/admin/orders')
                    ? 'text-white font-semibold'
                    : 'text-[#8aa4af] hover:text-white'
                }`}
              >
                Orders
              </Link>
              <Link
                href="/admin/transactions"
                className={`block pl-10 pr-4 py-2 transition-colors ${
                  isLinkActive('/admin/transactions')
                    ? 'text-white font-semibold'
                    : 'text-[#8aa4af] hover:text-white'
                }`}
              >
                Transactions
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/admin/digital-sales"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/digital-sales')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#8aa4af]" />
          <span>Digital Sales</span>
        </Link>

        <Link
          href="/admin/refund-requests"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/refund-requests')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Flag className="w-4 h-4 text-[#8aa4af]" />
          <span>Refund Requests</span>
        </Link>

        {/* PRODUCTS SECTION */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Products
        </div>

        <div>
          <button
            type="button"
            onClick={() => toggleSection('products')}
            className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors border-l-[3px] ${
              pathname.includes('/admin/products')
                ? 'bg-[#1e282c] text-white border-[#00a99d]'
                : 'border-transparent hover:bg-[#1e282c] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#8aa4af]" />
              <span>Products</span>
            </div>
            {openSections.products ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />
            )}
          </button>

          {openSections.products && (
            <div className="bg-[#2c3443] py-1 text-[12.5px]">
              {[
                ['Products', '/admin/products'],
                ['Featured Products', '/admin/products?list=featured'],
                ['Special Offers', '/admin/products?list=special-offers'],
                ['Pending Products', '/admin/products?list=pending'],
                ['Hidden Products', '/admin/products?list=hidden'],
                ['Expired Products', '/admin/products?list=expired'],
                ['Sold Products', '/admin/products?list=sold'],
                ['Drafts', '/admin/products?list=drafts'],
                ['Deleted Products', '/admin/products?list=deleted'],
                ['Add Product', '/dashboard/add-product'],
                ['Bulk Product Upload', '/admin/products/bulk-upload'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={`block pl-10 pr-4 py-2 transition-colors ${
                    isLinkActive(href)
                      ? 'text-white font-semibold'
                      : 'text-[#9aa9c7] hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/admin/quote-requests"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/quote-requests')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4 text-[#8aa4af]" />
          <span>Quote Requests</span>
        </Link>

        <Link
          href="/admin/categories"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/categories')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Folder className="w-4 h-4 text-[#8aa4af]" />
          <span>Categories</span>
        </Link>

        <Link
          href="/admin/tags"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/tags')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4 text-[#8aa4af]" />
          <span>Tags</span>
        </Link>

        <Link
          href="/admin/brands"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/brands')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <Asterisk className="w-4 h-4 text-[#8aa4af]" />
          <span>Brands</span>
        </Link>

        <Link
          href="/admin/custom-fields"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/custom-fields')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#8aa4af]" />
          <span>Custom Fields</span>
        </Link>

        {/* PAYMENTS SECTION */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Payments
        </div>

        {[
          { key: 'payments', label: 'Payments', icon: CreditCard, href: '/admin/payments', items: ['Membership Payments', 'Promotion Payments', 'Wallet Deposits', 'Bank Transfer Reports'] },
          { key: 'earnings', label: 'Earnings', icon: Coins, href: '/admin/earnings', items: ['Earnings', 'Seller Balances'] },
          { key: 'payouts', label: 'Payouts', icon: Wallet, href: '/admin/payouts', items: ['Add Payout', 'Payout Requests', 'Payout Settings'] },
        ].map((section) => {
          const Icon = section.icon;
          const isOpen = openSections[section.key];
          return (
            <div key={section.key}>
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors border-l-[3px] ${
                  pathname.includes(section.href)
                    ? 'bg-[#1e282c] text-white border-[#00a99d]'
                    : 'border-transparent hover:bg-[#1e282c] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5"><Icon className="w-4 h-4 text-[#8aa4af]" /><span>{section.label}</span></span>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />}
              </button>
              {isOpen && (
                <div className="bg-[#2c3443] py-1 text-[12.5px]">
                  <Link href={section.href} className={`block pl-10 pr-4 py-2 ${isLinkActive(section.href) ? 'text-white font-semibold' : 'text-[#9aa9c7] hover:text-white'}`}>{section.label}</Link>
                  {section.items.map((item) => <Link key={item} href={`${section.href}?section=${item.toLowerCase().replace(/ /g, '-')}`} className="block pl-10 pr-4 py-2 text-[#9aa9c7] hover:text-white">{item}</Link>)}
                </div>
              )}
            </div>
          );
        })}

        {/* CONTENT SECTION */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Content
        </div>

        <Link
          href="/admin/pages"
          className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors border-l-[3px] ${
            isLinkActive('/admin/pages')
              ? 'bg-[#1e282c] text-white border-[#00a99d]'
              : 'border-transparent hover:bg-[#1e282c] hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-[#8aa4af]" />
          <span>Pages</span>
        </Link>

        {[
          { key: 'blog', label: 'Blog', icon: Newspaper, href: '/admin/blog', items: ['Posts', 'Categories'] },
          { key: 'location', label: 'Location', icon: MapPin, href: '/admin/location', items: ['Countries', 'States', 'Cities'] },
        ].map((section) => {
          const Icon = section.icon;
          const isOpen = openSections[section.key];
          return (
            <div key={section.key}>
              <button type="button" onClick={() => toggleSection(section.key)} className={`w-full flex items-center justify-between px-4 py-2.5 border-l-[3px] transition-colors ${pathname.includes(section.href) ? 'bg-[#1e282c] text-white border-[#00a99d]' : 'border-transparent hover:bg-[#1e282c] hover:text-white'}`}>
                <span className="flex items-center gap-2.5"><Icon className="w-4 h-4 text-[#8aa4af]" /><span>{section.label}</span></span>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />}
              </button>
              {isOpen && <div className="bg-[#2c3443] py-1 text-[12.5px]">
                <Link href={section.href} className="block pl-10 pr-4 py-2 text-white font-semibold">{section.label}</Link>
                {section.items.map((item) => <Link key={item} href={`${section.href}?section=${item.toLowerCase()}`} className="block pl-10 pr-4 py-2 text-[#9aa9c7] hover:text-white">{item}</Link>)}
              </div>}
            </div>
          );
        })}

        {/* MEMBERSHIP SECTION */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Membership
        </div>

        <button type="button" onClick={() => toggleSection('membership')} className={`w-full flex items-center justify-between px-4 py-2.5 border-l-[3px] transition-colors ${pathname.includes('/admin/users') || pathname.includes('/admin/roles-permissions') ? 'bg-[#1e282c] text-white border-[#00a99d]' : 'border-transparent hover:bg-[#1e282c] hover:text-white'}`}>
          <span className="flex items-center gap-2.5"><Users className="w-4 h-4 text-[#8aa4af]" /><span>Membership</span></span>
          {openSections.membership ? <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />}
        </button>
        {openSections.membership && <div className="bg-[#2c3443] py-1 text-[12.5px]">
          {['Users', 'Membership Plans', 'Shop Opening Requests', 'User Login Activities', 'Account Deletion Requests'].map((item) => <Link key={item} href={`/admin/users?section=${item.toLowerCase().replace(/ /g, '-')}`} className="block pl-10 pr-4 py-2 text-[#9aa9c7] hover:text-white">{item}</Link>)}
        </div>}
        <Link href="/admin/roles-permissions" className="flex items-center gap-2.5 px-4 py-2.5 border-l-[3px] border-transparent hover:bg-[#1e282c] hover:text-white"><ShieldCheck className="w-4 h-4 text-[#8aa4af]" /><span>Roles & Permissions</span></Link>

        {/* MANAGEMENT TOOLS */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Management Tools
        </div>
        <button type="button" onClick={() => toggleSection('help')} className={`w-full flex items-center justify-between px-4 py-2.5 border-l-[3px] transition-colors ${pathname.includes('/admin/help-center') ? 'bg-[#1e282c] text-white border-[#00a99d]' : 'border-transparent hover:bg-[#1e282c] hover:text-white'}`}>
          <span className="flex items-center gap-2.5"><HelpCircle className="w-4 h-4 text-[#8aa4af]" /><span>Help Center</span></span>
          {openSections.help ? <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />}
        </button>
        {openSections.help && <div className="bg-[#2c3443] py-1 text-[12.5px]">{['Support Tickets', 'Knowledge Base'].map((item) => <Link key={item} href={`/admin/help-center?section=${item.toLowerCase().replace(/ /g, '-')}`} className="block pl-10 pr-4 py-2 text-[#9aa9c7] hover:text-white">{item}</Link>)}</div>}
        {[
          ['Cache System', Database, '/admin/cache-system'], ['SEO Tools', Wrench, '/admin/seo-tools'], ['Ad Spaces', Megaphone, '/admin/ad-spaces'],
          ['Chat Messages', MessageSquare, '/admin/chat-messages'], ['Contact Messages', Send, '/admin/contact-messages'], ['Reviews', Star, '/admin/reviews'],
          ['Newsletter', Mail, '/admin/newsletter'], ['Affiliate Program', Link2, '/admin/affiliate-program'], ['Abuse Reports', AlertTriangle, '/admin/abuse-reports'], ['Email Blacklist', Ban, '/admin/email-blacklist'],
        ].map(([label, Icon, href]) => {
          const ToolIcon = Icon as React.ComponentType<{ className?: string }>;
          return <Link key={String(label)} href={String(href)} className="flex items-center gap-2.5 px-4 py-2.5 border-l-[3px] border-transparent hover:bg-[#1e282c] hover:text-white"><ToolIcon className="w-4 h-4 text-[#8aa4af]" /><span>{String(label)}</span></Link>;
        })}
        <button type="button" onClick={() => toggleSection('comments')} className={`w-full flex items-center justify-between px-4 py-2.5 border-l-[3px] transition-colors ${pathname.includes('/admin/comments') ? 'bg-[#1e282c] text-white border-[#00a99d]' : 'border-transparent hover:bg-[#1e282c] hover:text-white'}`}>
          <span className="flex items-center gap-2.5"><MessageSquare className="w-4 h-4 text-[#8aa4af]" /><span>Comments</span></span>
          {openSections.comments ? <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />}
        </button>
        {openSections.comments && <div className="bg-[#2c3443] py-1 text-[12.5px]">{['Product Comments', 'Blog Comments'].map((item) => <Link key={item} href={`/admin/comments?section=${item.toLowerCase().replace(/ /g, '-')}`} className="block pl-10 pr-4 py-2 text-[#9aa9c7] hover:text-white">{item}</Link>)}</div>}

        {/* SETTINGS SECTION */}
        <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4b646f]">
          Settings
        </div>

        <Link href="/admin/preferences" className="flex items-center gap-2.5 px-4 py-2.5 border-l-[3px] border-transparent hover:bg-[#1e282c] hover:text-white"><List className="w-4 h-4 text-[#8aa4af]" /><span>Preferences</span></Link>
        <button type="button" onClick={() => toggleSection('settings')} className={`w-full flex items-center justify-between px-4 py-2.5 border-l-[3px] transition-colors ${pathname.includes('/admin/settings') ? 'bg-[#1e282c] text-white border-[#00a99d]' : 'border-transparent hover:bg-[#1e282c] hover:text-white'}`}>
          <span className="flex items-center gap-2.5"><Settings className="w-4 h-4 text-[#8aa4af]" /><span>Settings</span></span>
          {openSections.settings ? <ChevronDown className="w-3.5 h-3.5 text-[#8aa4af]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#8aa4af]" />}
        </button>
        {openSections.settings && <div className="bg-[#2c3443] py-1 text-[12.5px]">{['General Settings', 'Language Settings', 'Product Settings', 'Payment Settings', 'Currency Settings', 'Email Settings', 'Social Login', 'Visual Settings', 'Font Settings', 'Route Settings'].map((item) => <Link key={item} href={`/admin/settings?section=${item.toLowerCase().replace(/ /g, '-')}`} className="block pl-10 pr-4 py-2 text-[#9aa9c7] hover:text-white">{item}</Link>)}</div>}
        <Link href="/admin/backup" className="mx-3 mt-2 mb-1 flex items-center gap-2 px-3 py-2 rounded-[3px] bg-[#2c3443] border border-[#293342] text-[#9aa9c7] text-[12.5px] hover:text-white"><Download className="w-4 h-4" /><span>Download Database Backup</span></Link>

        <div className="h-8" />
      </div>
    </aside>
  );
}
