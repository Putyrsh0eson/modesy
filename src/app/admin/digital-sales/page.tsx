'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export default function AdminDigitalSalesPage() {
  const digitalSales = [
    { id: 1, orderId: '#10014', buyer: 'Peter Jone', product: 'Minimal UI Dashboard Kit.zip', price: 29.00, downloads: 3, date: '2026-09-05' },
    { id: 2, orderId: '#10009', buyer: 'Admin', product: 'Audio Tracks Pack Vol 2.mp3', price: 15.50, downloads: 1, date: '2026-08-28' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold text-[#333333]">Digital Sales</h1>
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] min-w-[650px]">
            <thead className="border-b border-[#dee2e6] text-[#555555] bg-[#fafafa]">
              <tr>
                <th className="py-2.5 px-3">Id</th>
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Buyer</th>
                <th className="py-2.5 px-3">Digital File / Product</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Downloads</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {digitalSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3 text-[#777777]">{sale.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#00a99d]">{sale.orderId}</td>
                  <td className="py-2.5 px-3 font-medium text-[#333333]">{sale.buyer}</td>
                  <td className="py-2.5 px-3 flex items-center gap-1.5 text-[#333333]">
                    <FileText className="w-3.5 h-3.5 text-[#00a99d]" />
                    <span>{sale.product}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">${sale.price.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{sale.downloads} times</td>
                  <td className="py-2.5 px-3 text-right text-[#777777]">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
