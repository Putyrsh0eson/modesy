'use client';

import React, { useEffect, useState } from 'react';
import { vendorService, VendorSale } from '@/services/vendorService';
import { marketplaceStore } from '@/services/marketplaceStore';
import { Search, Edit3, X } from 'lucide-react';

export default function VendorSalesPage() {
  const [sales, setSales] = useState<VendorSale[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  // Status update modal state
  const [selectedSale, setSelectedSale] = useState<VendorSale | null>(null);
  const [newStatus, setNewStatus] = useState<VendorSale['orderStatus']>('shipped');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const fetchSales = () => {
      vendorService.getSales(activeTab).then(setSales);
    };
    fetchSales();
    return marketplaceStore.subscribe(fetchSales);
  }, [activeTab]);

  const handleOpenModal = (sale: VendorSale) => {
    setSelectedSale(sale);
    setNewStatus(sale.orderStatus);
    setTrackingNumber(sale.trackingNumber || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale) return;

    await vendorService.updateSaleStatus(selectedSale.id, newStatus, trackingNumber);
    setSales(prev =>
      prev.map(s => (s.id === selectedSale.id ? { ...s, orderStatus: newStatus, trackingNumber } : s))
    );
    setSelectedSale(null);
  };

  const filtered = sales.filter(s =>
    s.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.buyerName.toLowerCase().includes(search.toLowerCase()) ||
    s.productTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sales Orders</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer orders and update shipping delivery progress</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'processing', label: 'Processing' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#222d32] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search order or buyer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-[#e6e8eb] text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Product Ordered</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8eb]">
              {filtered.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">{sale.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                    {sale.productTitle} (x{sale.quantity})
                  </td>
                  <td className="px-4 py-3 text-gray-700">{sale.buyerName}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">${sale.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        sale.orderStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sale.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : sale.orderStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sale.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                    {sale.trackingNumber || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(sale)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Update Order #{selectedSale.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as typeof newStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="processing">Processing (Preparing Item)</option>
                  <option value="shipped">Shipped (In Transit)</option>
                  <option value="completed">Completed (Delivered)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tracking Number / Courier Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. DHL-982736192 or JNE-192847"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedSale(null)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#222d32] text-white rounded text-xs font-bold hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
