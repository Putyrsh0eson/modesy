'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { marketplaceStore, StoreTransaction } from '@/services/marketplaceStore';
import { Order, Product } from '@/types/modesy';
import { useModesy } from '@/context/ModesyContext';
import {
  ShoppingCart,
  ShoppingBag,
  EyeOff,
  Users,
  Minus,
  X
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useModesy();
  const isModerator = user?.email === 'moderator@codingest.net';
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<StoreTransaction[]>([]);
  const [membersCount, setMembersCount] = useState<number>(7);

  useEffect(() => {
    const sync = () => {
      setOrders(marketplaceStore.getOrders());
      setProducts(marketplaceStore.getProducts());
      setPendingProducts(marketplaceStore.getPendingProducts());
      setTransactions(marketplaceStore.getTransactions());
      setMembersCount(marketplaceStore.getMembersCount());
    };
    sync();
    return marketplaceStore.subscribe(sync);
  }, []);

  return (
    <div className="space-y-5">
      {/* Top 4 Stat Boxes (AdminLTE Modesy PHP Exact Replica) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Box 1: Orders (Green #16a085 / #00a65a) */}
        {!isModerator && <div className="relative overflow-hidden rounded-[3px] bg-[#16a085] text-white p-3.5 shadow-[0_1px_1px_rgba(0,0,0,0.1)] group min-h-[104px]">
          <div className="relative z-10">
            <h3 className="text-[28px] font-bold tracking-tight mb-1 leading-none">{orders.length}</h3>
            <Link
              href="/admin/orders"
              className="text-[13px] font-medium text-white/95 hover:text-white transition-colors"
            >
              Orders
            </Link>
          </div>
          <div className="absolute right-3 bottom-2 text-black/15 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
            <ShoppingCart className="w-14 h-14" strokeWidth={1.4} />
          </div>
        </div>}

        {/* Box 2: Products (Purple #605ca8) */}
        <div className="relative overflow-hidden rounded-[3px] bg-[#605ca8] text-white p-3.5 shadow-[0_1px_1px_rgba(0,0,0,0.1)] group min-h-[104px]">
          <div className="relative z-10">
            <h3 className="text-[28px] font-bold tracking-tight mb-1 leading-none">{products.length}</h3>
            <Link
              href="/admin/products"
              className="text-[13px] font-medium text-white/95 hover:text-white transition-colors"
            >
              Products
            </Link>
          </div>
          <div className="absolute right-3 bottom-2 text-black/15 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
            <ShoppingBag className="w-14 h-14" strokeWidth={1.4} />
          </div>
        </div>

        {/* Box 3: Pending Products (Red #dd4b39) */}
        <div className="relative overflow-hidden rounded-[3px] bg-[#dd4b39] text-white p-3.5 shadow-[0_1px_1px_rgba(0,0,0,0.1)] group min-h-[104px]">
          <div className="relative z-10">
            <h3 className="text-[28px] font-bold tracking-tight mb-1 leading-none">{pendingProducts.length}</h3>
            <Link
              href="/admin/products?list=pending"
              className="text-[13px] font-medium text-white/95 hover:text-white transition-colors"
            >
              Pending Products
            </Link>
          </div>
          <div className="absolute right-3 bottom-2 text-black/15 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
            <EyeOff className="w-14 h-14" strokeWidth={1.4} />
          </div>
        </div>

        {/* Box 4: Members (Warm Amber #f39c12) */}
        {!isModerator && <div className="relative overflow-hidden rounded-[3px] bg-[#f39c12] text-white p-3.5 shadow-[0_1px_1px_rgba(0,0,0,0.1)] group min-h-[104px]">
          <div className="relative z-10">
            <h3 className="text-[28px] font-bold tracking-tight mb-1 leading-none">{membersCount}</h3>
            <Link
              href="/admin/users"
              className="text-[13px] font-medium text-white/95 hover:text-white transition-colors"
            >
              Members
            </Link>
          </div>
          <div className="absolute right-3 bottom-2 text-black/15 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
            <Users className="w-14 h-14" strokeWidth={1.4} />
          </div>
        </div>}
      </div>

      {/* Row 1: Latest Orders & Latest Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Latest Orders Box */}
        <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#00c0ef] border-x border-b border-[#e5e7eb] shadow-[0_1px_1px_rgba(0,0,0,0.05)] flex flex-col">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-[#f4f4f4] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#333333]">Latest Orders</h3>
            <div className="flex items-center gap-1.5 text-[#97a0b3]">
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Collapse">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Remove">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 max-h-[340px] overflow-y-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead className="bg-white border-b border-[#f4f4f4] text-[#444444] font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f4] text-[#555555]">
                {orders.slice(0, 7).map((order) => (
                  <tr key={order.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-2 px-3 font-semibold text-[#333333]">
                      {order.orderNumber}
                    </td>
                    <td className="py-2 px-3 font-medium text-[#444444]">
                      ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                    </td>
                    <td className="py-2 px-3">
                      <span className="capitalize text-[#444444] text-[12px]">
                        {order.status === 'processing' ? 'Processing' : order.status === 'completed' ? 'Completed' : order.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#777777] text-[11.5px] whitespace-nowrap">
                      {order.createdAt}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="inline-block px-2.5 py-1 bg-[#17a2b8] hover:bg-[#138496] text-white text-[11px] font-medium rounded-[2px] transition-colors shadow-2xs"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2.5 border-t border-[#f4f4f4] bg-white flex justify-end">
            <Link
              href="/admin/orders"
              className="px-3 py-1 bg-[#f4f4f4] hover:bg-[#e7e7e7] text-[#444444] text-[12px] font-medium rounded-[2px] border border-[#dddddd] transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Latest Transactions Box */}
        <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#00c0ef] border-x border-b border-[#e5e7eb] shadow-[0_1px_1px_rgba(0,0,0,0.05)] flex flex-col">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-[#f4f4f4] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#333333]">Latest Transactions</h3>
            <div className="flex items-center gap-1.5 text-[#97a0b3]">
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Collapse">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Remove">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 max-h-[340px] overflow-y-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead className="bg-white border-b border-[#f4f4f4] text-[#444444] font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Id</th>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Payment Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f4] text-[#555555]">
                {transactions.slice(0, 7).map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-2 px-3 text-[#555555] font-medium">{tx.id}</td>
                    <td className="py-2 px-3 font-semibold text-[#333333]">{tx.orderNumber}</td>
                    <td className="py-2 px-3 font-medium text-[#333333]">${tx.paymentAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#555555]">{tx.paymentMethod}</td>
                    <td className="py-2 px-3 text-[#00a65a] font-medium text-[12px]">{tx.paymentStatus}</td>
                    <td className="py-2 px-3 text-[#777777] text-[11.5px] whitespace-nowrap">{tx.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2.5 border-t border-[#f4f4f4] bg-white flex justify-end">
            <Link
              href="/admin/transactions"
              className="px-3 py-1 bg-[#f4f4f4] hover:bg-[#e7e7e7] text-[#444444] text-[12px] font-medium rounded-[2px] border border-[#dddddd] transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Latest Products & Latest Pending Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Latest Products Box */}
        <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#00c0ef] border-x border-b border-[#e5e7eb] shadow-[0_1px_1px_rgba(0,0,0,0.05)] flex flex-col">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-[#f4f4f4] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#333333]">Latest Products</h3>
            <div className="flex items-center gap-1.5 text-[#97a0b3]">
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Collapse">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Remove">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 max-h-[340px] overflow-y-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead className="bg-white border-b border-[#f4f4f4] text-[#444444] font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3 w-[10%]">Id</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3 text-right w-[15%]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f4] text-[#555555]">
                {products.slice(0, 6).map((p) => (
                  <tr key={p.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-2.5 px-3 text-[#555555] font-medium">{String(p.id).substring(0, 6)}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-[#eef0f3] overflow-hidden shrink-0 relative bg-[#f8f9fa]">
                          <Image
                            src={p.image || '/sites/modesy/banner-clothing.jpg'}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="font-medium text-[#333333] hover:text-[#00a99d] transition-colors line-clamp-1 block"
                          >
                            {p.title}
                          </Link>
                          <span className="text-[11px] text-[#888888]">
                            ${p.price ? p.price.toFixed(2) : '0.00'} • {p.category || 'Clothing'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/admin/products`}
                        className="inline-block px-2.5 py-1 bg-[#17a2b8] hover:bg-[#138496] text-white text-[11px] font-medium rounded-[2px] transition-colors shadow-2xs"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2.5 border-t border-[#f4f4f4] bg-white flex justify-end">
            <Link
              href="/admin/products"
              className="px-3 py-1 bg-[#f4f4f4] hover:bg-[#e7e7e7] text-[#444444] text-[12px] font-medium rounded-[2px] border border-[#dddddd] transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Latest Pending Products Box */}
        <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#00c0ef] border-x border-b border-[#e5e7eb] shadow-[0_1px_1px_rgba(0,0,0,0.05)] flex flex-col">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-[#f4f4f4] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#333333]">Latest Pending Products</h3>
            <div className="flex items-center gap-1.5 text-[#97a0b3]">
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Collapse">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:text-[#333333] transition-colors" aria-label="Remove">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 max-h-[340px] overflow-y-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead className="bg-white border-b border-[#f4f4f4] text-[#444444] font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3 w-[10%]">Id</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3 text-right w-[15%]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f4] text-[#555555]">
                {pendingProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[#888888] text-[13px]">
                      No pending products found.
                    </td>
                  </tr>
                ) : (
                  pendingProducts.slice(0, 6).map((p) => (
                    <tr key={p.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-2.5 px-3 text-[#555555] font-medium">{String(p.id).substring(0, 6)}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-[#eef0f3] overflow-hidden shrink-0 relative bg-[#f8f9fa]">
                            <Image
                              src={p.image || '/sites/modesy/banner-clothing.jpg'}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-[#333333] line-clamp-1 block">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-[#888888]">
                              ${p.price ? p.price.toFixed(2) : '0.00'} • Pending Approval
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href="/admin/products?list=pending"
                          className="inline-block px-2.5 py-1 bg-[#17a2b8] hover:bg-[#138496] text-white text-[11px] font-medium rounded-[2px] transition-colors shadow-2xs"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2.5 border-t border-[#f4f4f4] bg-white flex justify-end">
            <Link
              href="/admin/products?list=pending"
              className="px-3 py-1 bg-[#f4f4f4] hover:bg-[#e7e7e7] text-[#444444] text-[12px] font-medium rounded-[2px] border border-[#dddddd] transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
