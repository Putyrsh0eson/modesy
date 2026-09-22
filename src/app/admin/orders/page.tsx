'use client';

import React, { useState, useEffect } from 'react';
import { marketplaceStore } from '@/services/marketplaceStore';
import { AdminOrder } from '@/types/admin';
import { Eye, X } from 'lucide-react';

const mapStoreOrders = (): AdminOrder[] => {
  return marketplaceStore.getOrders().map((o, idx) => ({
    id: Number(o.id) || idx + 1,
    orderNumber: o.orderNumber,
    buyerName: o.customer.fullName || 'Customer',
    buyerEmail: o.customer.email || 'customer@example.com',
    totalAmount: typeof o.total === 'number' ? o.total : parseFloat(String(o.total)) || 0,
    currency: o.currency || 'USD',
    paymentStatus: 'Paid',
    orderStatus: (o.status.charAt(0).toUpperCase() + o.status.slice(1)) as AdminOrder['orderStatus'],
    itemCount: o.items.length,
    date: o.createdAt || '2026-09-14'
  }));
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    const sync = () => {
      setOrders(mapStoreOrders());
    };
    sync();
    return marketplaceStore.subscribe(sync);
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: number, newStatus: AdminOrder['orderStatus']) => {
    const target = orders.find(o => o.id === id);
    if (target) {
      marketplaceStore.updateSaleStatus(target.orderNumber, newStatus.toLowerCase() as any);
    }
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">Orders</h1>
      </div>

      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#f1f3f5]">
          <div className="flex items-center gap-1 overflow-x-auto text-[13px]">
            {['All', 'Processing', 'Completed', 'Shipped', 'Cancelled'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  filterStatus === status
                    ? 'bg-[#5b5394] text-white font-medium'
                    : 'bg-[#f8f9fa] text-[#555555] hover:bg-[#e9ecef]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order or buyer..."
              className="h-[34px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[13px] text-[#333333] placeholder-[#999999] focus:outline-none focus:border-[#00a99d] w-[200px]"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#dee2e6] text-[#333333] font-semibold bg-[#fafafa]">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Buyer</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#888888]">
                    No orders match your filter
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f8f9fa]">
                    <td className="py-2.5 px-3 font-semibold text-[#00a99d]">{order.orderNumber}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[#333333]">{order.buyerName}</div>
                      <div className="text-[11px] text-[#888888]">{order.buyerEmail}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#333333]">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#e6f4ea] text-[#137333]">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                          order.orderStatus === 'Completed'
                            ? 'bg-[#e6f4ea] text-[#137333]'
                            : order.orderStatus === 'Processing'
                            ? 'bg-[#fef7e0] text-[#b06000]'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-[#e8f0fe] text-[#1967d2]'
                            : 'bg-[#fce8e6] text-[#c5221f]'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#555555]">{order.itemCount} items</td>
                    <td className="py-2.5 px-3 text-[#555555] whitespace-nowrap">{order.date}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 bg-[#5b5394] hover:bg-[#4c457d] text-white text-[11.5px] rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-md max-w-lg w-full shadow-2xl overflow-hidden border border-[#dee2e6]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#dee2e6]">
              <h3 className="font-bold text-[15px] text-[#333333]">
                Order Details: {selectedOrder.orderNumber}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-[#888888] hover:text-[#222222]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#f1f3f5]">
                <div>
                  <span className="text-[#888888] block text-[11px] uppercase">Buyer Information</span>
                  <div className="font-semibold text-[#333333]">{selectedOrder.buyerName}</div>
                  <div className="text-[#666666]">{selectedOrder.buyerEmail}</div>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px] uppercase">Order Info</span>
                  <div className="font-semibold text-[#00a99d]">{selectedOrder.orderNumber}</div>
                  <div className="text-[#666666]">{selectedOrder.date}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#f1f3f5]">
                <span className="text-[#555555]">Total Price:</span>
                <span className="text-base font-bold text-[#333333]">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              <div>
                <span className="text-[#555555] block mb-1.5 font-medium">Update Order Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(['Processing', 'Shipped', 'Completed', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1 text-[12px] rounded border ${
                        selectedOrder.orderStatus === st
                          ? 'bg-[#00a99d] border-[#00a99d] text-white font-semibold'
                          : 'bg-white border-[#dee2e6] text-[#444444] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-[#f8f9fa] border-t border-[#dee2e6] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded bg-[#6c757d] text-white text-[12.5px] hover:bg-[#5a6268] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
