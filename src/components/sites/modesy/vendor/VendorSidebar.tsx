'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModesy } from '@/context/ModesyContext';
import {
  Home,
  FileText,
  CloudUpload,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Ticket,
  Flag,
  Banknote,
  CreditCard,
  MessageSquare,
  Star,
  Settings,
  FileCode2,
  Truck,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface VendorSidebarProps {
  isCollapsed: boolean;
  onCloseMobile?: () => void;
}

export function VendorSidebar({ isCollapsed, onCloseMobile }: VendorSidebarProps) {
  const pathname = usePathname();
  const { user } = useModesy();
  const displayName = user?.username || 'Trendshop';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  // Submenu open states matching screenshot
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    products: false,
    sales: false,
    payments: false,
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isNavActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-[#eef0f3] transition-all duration-300 select-none shadow-[0_3px_10px_0_#eef3f6] ${
        isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-center px-4 bg-white border-b border-transparent">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          {!isCollapsed ? (
            <span className="text-[26px] font-bold tracking-tight text-[#222d32] font-sans">
              Modesy
            </span>
          ) : (
            <span className="text-xl font-bold text-[#222d32]">M</span>
          )}
        </Link>
      </div>

      {/* User Avatar & Greeting Profile Panel */}
      {!isCollapsed && (
        <div className="pt-2 pb-5 px-4 flex flex-col items-center justify-center text-center">
          <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#26d9ff] to-[#7076ff] shadow-sm">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    const target = event.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#f7d75f] via-[#f0c26a] to-[#b37d28] opacity-90 flex items-center justify-center">
                  <span className="text-white font-bold text-lg drop-shadow-sm">{avatarInitial}</span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-[14px] font-bold text-[#333B53] tracking-tight">
            Hi, {displayName}
          </p>
        </div>
      )}

      {/* Sidebar Menu Items */}
      <div className="flex-1 overflow-y-auto px-0 py-2 text-[13px] text-[#414456] custom-scrollbar">
        {/* SECTION: NAVIGATION */}
        <div className="mb-2">
          {!isCollapsed && (
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#949CB4]">
              NAVIGATION
            </div>
          )}
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              pathname === '/dashboard'
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold border-l-4 border-[#00a99d]'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Dashboard"
          >
            <Home className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </div>

        {/* SECTION: PRODUCTS */}
        <div className="mb-2">
          {!isCollapsed && (
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#949CB4]">
              PRODUCTS
            </div>
          )}

          <Link
            href="/dashboard/add-product"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/add-product')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Add Product"
          >
            <FileText className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Add Product</span>}
          </Link>

          <Link
            href="/dashboard/bulk-product-upload"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/bulk-product-upload')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Bulk Product Upload"
          >
            <CloudUpload className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Bulk Product Upload</span>}
          </Link>

          <div>
            <button
              onClick={() => toggleSubmenu('products')}
              className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors ${
                isNavActive('/dashboard/products')
                  ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                  : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title="Products"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#687088] shrink-0" />
                {!isCollapsed && <span>Products</span>}
              </div>
              {!isCollapsed && (
                openSubmenus.products ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
                )
              )}
            </button>
            {!isCollapsed && openSubmenus.products && (
              <div className="bg-[#F7F8FC] py-1 text-[12px]">
                <Link
                  href="/dashboard/products"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Products
                </Link>
                <Link
                  href="/dashboard/products?st=pending"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Pending Products
                </Link>
                <Link
                  href="/dashboard/products?st=hidden"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Hidden Products
                </Link>
                <Link
                  href="/dashboard/products?st=sold"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Sold Products
                </Link>
                <Link
                  href="/dashboard/products?st=draft"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Drafts
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: SALES */}
        <div className="mb-2">
          {!isCollapsed && (
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#949CB4]">
              SALES
            </div>
          )}

          <div>
            <button
              onClick={() => toggleSubmenu('sales')}
              className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors ${
                isNavActive('/dashboard/sales')
                  ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                  : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title="Sales"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-[#687088] shrink-0" />
                {!isCollapsed && <span>Sales</span>}
              </div>
              {!isCollapsed && (
                openSubmenus.sales ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
                )
              )}
            </button>
            {!isCollapsed && openSubmenus.sales && (
              <div className="bg-[#F7F8FC] py-1 text-[12px]">
                <Link
                  href="/dashboard/sales"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Active Sales
                </Link>
                <Link
                  href="/dashboard/sales?st=completed"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Completed Sales
                </Link>
                <Link
                  href="/dashboard/sales?st=cancelled"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Cancelled Sales
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/dashboard/quote-requests"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/quote-requests')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Quote Requests"
          >
            <Tag className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Quote Requests</span>}
          </Link>

          <Link
            href="/dashboard/coupons"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/coupons')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Coupons"
          >
            <Ticket className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Coupons</span>}
          </Link>

          <Link
            href="/dashboard/refund-requests"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/refund-requests')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Refund Requests"
          >
            <div className="flex items-center gap-3">
              <Flag className="w-4 h-4 text-[#687088] shrink-0" />
              {!isCollapsed && <span>Refund Requests</span>}
            </div>
            {!isCollapsed && (
              <span className="w-4 h-4 rounded bg-[#00a99d] text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/cash-on-delivery"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/cash-on-delivery')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Cash on Delivery"
          >
            <Banknote className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Cash on Delivery</span>}
          </Link>
        </div>

        {/* SECTION: PAYMENTS */}
        <div className="mb-2">
          {!isCollapsed && (
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#949CB4]">
              PAYMENTS
            </div>
          )}

          <div>
            <button
              onClick={() => toggleSubmenu('payments')}
              className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors ${
                isNavActive('/dashboard/payments')
                  ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                  : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title="Payments"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-[#687088] shrink-0" />
                {!isCollapsed && <span>Payments</span>}
              </div>
              {!isCollapsed && (
                openSubmenus.payments ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
                )
              )}
            </button>
            {!isCollapsed && openSubmenus.payments && (
              <div className="bg-[#F7F8FC] py-1 text-[12px]">
                <Link
                  href="/dashboard/earnings"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Earnings
                </Link>
                <Link
                  href="/dashboard/payouts"
                  className="block px-12 py-1.5 text-[#525A72] hover:text-[#2C344C]"
                >
                  Payouts
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: COMMENTS */}
        <div className="mb-2">
          {!isCollapsed && (
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#949CB4]">
              COMMENTS
            </div>
          )}

          <Link
            href="/messages"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/messages')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Messages"
          >
            <MessageSquare className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Messages</span>}
          </Link>

          <Link
            href="/dashboard/comments"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/comments')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Comments"
          >
            <MessageSquare className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Comments</span>}
          </Link>

          <Link
            href="/dashboard/reviews"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/reviews')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Reviews"
          >
            <Star className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Reviews</span>}
          </Link>
        </div>

        {/* SECTION: SETTINGS */}
        <div className="mb-6">
          {!isCollapsed && (
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#949CB4]">
              SETTINGS
            </div>
          )}

          <Link
            href="/dashboard/shop-settings"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/shop-settings')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Shop Settings"
          >
            <Settings className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Shop Settings</span>}
          </Link>

          <Link
            href="/dashboard/shop-policies"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/shop-policies')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Shop Policies"
          >
            <FileCode2 className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Shop Policies</span>}
          </Link>

          <Link
            href="/dashboard/shipping-settings"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
              isNavActive('/dashboard/shipping-settings')
                ? 'text-[#2C344C] bg-[#F7F8FC] font-semibold'
                : 'text-[#414456] hover:text-[#2C344C] hover:bg-[#F7F8FC]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Shipping Settings"
          >
            <Truck className="w-4 h-4 text-[#687088] shrink-0" />
            {!isCollapsed && <span>Shipping Settings</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
