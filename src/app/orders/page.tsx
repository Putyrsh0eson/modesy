'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { customerService, CustomerOrder } from '@/services/customerService';
import { Eye, FileText } from 'lucide-react';

import { marketplaceStore } from '@/services/marketplaceStore';

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    customerService.getOrders().then(setOrders);
    const unsub = marketplaceStore.subscribe(() => {
      customerService.getOrders().then(setOrders);
    });
    return unsub;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">My Orders</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track your past purchases and delivery status</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Order Number</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Order Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    <Link href={`/orders/${order.id}`} className="text-indigo-600 hover:underline">
                      {order.orderNumber}
                    </Link>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {order.itemsCount} item{order.itemsCount > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 text-sm">
                    ${order.totalPrice.toFixed(2)} {order.currency}
                  </td>
                  <td className="px-5 py-4 text-gray-700">{order.paymentMethod}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        order.orderStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{order.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>
                      <Link
                        href={`/invoice/${order.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
