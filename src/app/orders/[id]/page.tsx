'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { customerService, CustomerOrder } from '@/services/customerService';
import { FileText, ArrowLeft, Truck, MapPin, Package } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    customerService.getOrderById(resolvedParams.id).then(setOrder);
  }, [resolvedParams.id]);

  if (!order) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading order details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between">
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/orders" className="hover:text-gray-900 inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{order.orderNumber}</span>
        </nav>

        <Link
          href={`/invoice/${order.id}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View / Print Invoice</span>
        </Link>
      </div>

      {/* Order Status Banner */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Order {order.orderNumber}</h1>
            <span
              className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                order.orderStatus === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Placed on {order.createdAt} • Payment: {order.paymentMethod}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Paid</p>
          <p className="text-2xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Grid: Order Items & Shipping Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span>Items in this Order ({order.items.length})</span>
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items.map(item => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden relative shrink-0 bg-gray-50">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-[11px] text-gray-400">Sold by: {item.vendor}</p>
                    <p className="text-[11px] text-gray-400 font-mono">SKU: {item.sku}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-900">${item.price.toFixed(2)}</p>
                  <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Shipping & Billing info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Shipping Address</span>
            </h2>

            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-gray-400 pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              <span>Shipping Method</span>
            </h2>
            <p className="text-xs text-gray-600">Standard Delivery (3-5 Business Days)</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Free Shipping Applied</p>
          </div>
        </div>
      </div>
    </div>
  );
}
