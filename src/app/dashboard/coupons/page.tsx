'use client';

import React, { useEffect, useState } from 'react';
import { vendorService, VendorCoupon } from '@/services/vendorService';
import { PlusCircle, Trash2, X } from 'lucide-react';

export default function VendorCouponsPage() {
  const [coupons, setCoupons] = useState<VendorCoupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountRate, setDiscountRate] = useState('15');
  const [type, setType] = useState<VendorCoupon['type']>('percentage');
  const [minOrder, setMinOrder] = useState('40');
  const [usageLimit, setUsageLimit] = useState('100');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  useEffect(() => {
    vendorService.getCoupons().then(setCoupons);
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon = await vendorService.createCoupon({
      code: code.toUpperCase(),
      discountRate: parseInt(discountRate),
      type,
      minOrder: parseFloat(minOrder),
      usageLimit: parseInt(usageLimit),
      status: true,
      expiryDate
    });
    setCoupons(prev => [newCoupon, ...prev]);
    setShowModal(false);
    setCode('');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete coupon code?')) {
      await vendorService.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Discount Coupons</h1>
          <p className="text-xs text-gray-500 mt-0.5">Create custom promotional vouchers for your storefront</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222d32] hover:bg-gray-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-[#e6e8eb] text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Coupon Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min Order</th>
                <th className="px-4 py-3">Usage Limit</th>
                <th className="px-4 py-3">Used</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8eb]">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-indigo-700 tracking-wider font-mono">
                    {c.code}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {c.discountRate}{c.type === 'percentage' ? '%' : ' USD'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">${c.minOrder.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{c.usageLimit} times</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">{c.usedCount} times</td>
                  <td className="px-4 py-3 text-gray-500">{c.expiryDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded hover:bg-gray-100"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Create Coupon Code</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Coupon Code (e.g. FLASH20)
                </label>
                <input
                  type="text"
                  required
                  placeholder="CODE"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono uppercase focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount Rate
                  </label>
                  <input
                    type="number"
                    required
                    value={discountRate}
                    onChange={e => setDiscountRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as typeof type)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Minimum Order ($)
                  </label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={e => setMinOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#222d32] text-white rounded text-xs font-bold hover:bg-gray-800"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
