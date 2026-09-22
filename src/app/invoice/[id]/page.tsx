'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { customerService, CustomerOrder } from '@/services/customerService';
import { Printer, ArrowLeft } from 'lucide-react';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    customerService.getOrderById(resolvedParams.id).then(setOrder);
  }, [resolvedParams.id]);

  if (!order) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading invoice...</div>;
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-10 font-sans print:bg-white print:py-0">
      {/* Print Controls (Hidden when printing) */}
      <div className="max-w-[898px] mx-auto mb-4 flex items-center justify-between print:hidden px-4">
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-bold shadow transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Invoice</span>
        </button>
      </div>

      {/* Invoice Sheet */}
      <div className="max-w-[898px] mx-auto bg-white rounded-lg shadow-sm border border-gray-200 print:border-0 print:shadow-none overflow-hidden">
        <div className="p-10 space-y-8">
          {/* Header Title */}
          <div className="text-center border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-normal text-gray-800 tracking-tight">INVOICE</h1>
          </div>

          {/* Company & Order Info */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-[#222d32] text-white flex items-center justify-center font-bold text-sm">
                  M
                </div>
                <span className="text-lg font-bold text-gray-800">Modesy</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>100 Marketplace Blvd, Suite 400</p>
                <p>contact@modesy.com</p>
                <p>+1 (800) 555-0199</p>
                <p className="text-gray-400">VAT / Tax ID: US-994820194</p>
              </div>
            </div>

            <div className="text-right text-xs">
              <p className="font-bold text-gray-800 text-sm">
                <span className="inline-block w-24 text-gray-500 font-normal">Invoice:</span>
                #{order.orderNumber.replace('#', '')}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="inline-block w-24 text-gray-500">Date:</span>
                {order.createdAt}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="inline-block w-24 text-gray-500">Status:</span>
                <span className="font-semibold text-emerald-600 uppercase">Paid</span>
              </p>
            </div>
          </div>

          {/* Client & Payment Info */}
          <div className="grid grid-cols-2 gap-8 border-t border-b border-gray-100 py-6 text-xs">
            <div>
              <h3 className="font-bold text-gray-800 mb-2 uppercase text-[11px] tracking-wider">
                Client Information
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="text-gray-400">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="font-bold text-gray-800 mb-2 uppercase text-[11px] tracking-wider">
                Payment Details
              </h3>
              <div className="text-gray-600 space-y-1">
                <p>
                  <span className="text-gray-400">Payment Status:</span>{' '}
                  <span className="font-semibold text-emerald-600">Succeeded</span>
                </p>
                <p>
                  <span className="text-gray-400">Payment Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="text-gray-400">Currency:</span> {order.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="border-b border-gray-200 text-gray-800 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3">Seller</th>
                  <th className="py-3">SKU</th>
                  <th className="py-3">Description</th>
                  <th className="py-3 text-center">Qty</th>
                  <th className="py-3 text-right">Unit Price</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-gray-800">{item.vendor}</td>
                    <td className="py-3 font-mono text-[11px] text-gray-400">{item.sku}</td>
                    <td className="py-3 font-medium text-gray-900">{item.title}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="font-medium">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT / Tax (0%):</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-emerald-600">${order.totalPrice.toFixed(2)} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-10 border-t border-gray-100 text-center text-[11px] text-gray-400">
            <p>Thank you for shopping at Modesy Marketplace!</p>
            <p className="mt-1">For any inquiries, please contact support@modesy.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
