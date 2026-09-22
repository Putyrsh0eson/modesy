'use client';

import React, { useEffect, useState } from 'react';
import { vendorService, VendorPayout } from '@/services/vendorService';
import { Wallet, CheckCircle, ArrowDownCircle, X } from 'lucide-react';

export default function VendorPayoutsPage() {
  const [payouts, setPayouts] = useState<VendorPayout[]>([]);
  const [balance, setBalance] = useState(1845.50);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('100');
  const [method, setMethod] = useState<VendorPayout['payoutMethod']>('PayPal');
  const [accountEmail, setAccountEmail] = useState('vendor@trendshop.com');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    vendorService.getPayouts().then(setPayouts);
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0 || withdrawAmount > balance) {
      alert('Invalid withdrawal amount');
      return;
    }

    const newPayout = await vendorService.requestPayout(withdrawAmount, method);
    setPayouts(prev => [newPayout, ...prev]);
    setBalance(prev => prev - withdrawAmount);
    setShowModal(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Payouts & Withdrawals</h1>
          <p className="text-xs text-gray-500 mt-0.5">Request balance withdrawals to your PayPal or Bank Account</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-md shadow-sm transition-colors"
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Withdraw Money</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Payout request submitted successfully! Admin will process your transfer.
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Available Balance</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">${balance.toFixed(2)}</h2>
          <p className="text-[11px] text-gray-500 mt-1">Minimum payout threshold: $50.00</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Wallet className="w-7 h-7" />
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e6e8eb]">
          <h2 className="text-sm font-bold text-gray-800">Withdrawal Request History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-[#e6e8eb] text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Payout ID</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8eb]">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">#PO-{p.id}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{p.payoutMethod}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">${p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Request Payout</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Withdrawal Method
                </label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as typeof method)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                  <option value="Swift">Swift / IBAN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {method === 'PayPal' ? 'PayPal Email Address' : 'Bank Account Number / IBAN'}
                </label>
                <input
                  type="text"
                  required
                  value={accountEmail}
                  onChange={e => setAccountEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Withdrawal Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="50"
                  max={balance}
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">Max available: ${balance.toFixed(2)}</span>
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
                  className="px-4 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white rounded text-xs font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
