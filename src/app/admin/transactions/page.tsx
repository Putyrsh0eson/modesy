'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { marketplaceStore } from '@/services/marketplaceStore';
import { AdminTransaction } from '@/types/admin';
import { ChevronDown, FileSpreadsheet, Eye, Trash2, X } from 'lucide-react';

const mapStoreTransactions = (): AdminTransaction[] => {
  return marketplaceStore.getTransactions().map(tx => ({
    id: tx.id,
    order: tx.orderNumber,
    paymentMethod: tx.paymentMethod,
    paymentId: `WLT-${tx.id}9XPB2QA3`,
    user: tx.user,
    currency: tx.currency,
    paymentAmount: tx.paymentAmount,
    paymentStatus: 'Succeeded',
    ipAddress: '127.0.0.1',
    date: tx.createdAt
  }));
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [searchOrder, setSearchOrder] = useState('');
  const [showCount, setShowCount] = useState(15);
  const [exportOpen, setExportOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);

  useEffect(() => {
    const sync = () => {
      setTransactions(mapStoreTransactions());
    };
    sync();
    return marketplaceStore.subscribe(sync);
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const all = mapStoreTransactions();
    if (!searchOrder.trim()) {
      setTransactions(all);
    } else {
      const q = searchOrder.toLowerCase().trim();
      setTransactions(
        all.filter(
          (t) =>
            t.order.toLowerCase().includes(q) ||
            t.paymentId.toLowerCase().includes(q) ||
            t.user.toLowerCase().includes(q)
        )
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to delete transaction #${id}?`)) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setActiveMenuId(null);
    }
  };

  const displayedList = transactions.slice(0, showCount);

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-[22px] font-bold text-[#333333]">Transactions</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        {/* Controls Toolbar */}
        <form onSubmit={handleFilter} className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#f1f3f5]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Show Count */}
            <div className="flex items-center gap-2 text-[13px] text-[#555555]">
              <span>Show</span>
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="h-[34px] px-2 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[#333333] focus:outline-none focus:border-[#00a99d]"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#555555]">Search</span>
              <input
                type="text"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="Order Number"
                className="h-[34px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[13px] text-[#333333] placeholder-[#999999] focus:outline-none focus:border-[#00a99d] w-[180px] sm:w-[220px]"
              />
              <button
                type="submit"
                className="h-[34px] px-4 bg-[#5b5394] hover:bg-[#4c457d] text-white text-[13px] font-medium rounded transition-colors"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="h-[34px] px-3 bg-[#f8f9fa] border border-[#dee2e6] hover:bg-[#e9ecef] text-[#444444] text-[13px] rounded flex items-center gap-1.5 transition-colors"
            >
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777777]" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-[#dee2e6] shadow-md rounded py-1 z-30 text-[12.5px]">
                <button
                  type="button"
                  onClick={() => {
                    alert('Transactions exported to CSV!');
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9fa] flex items-center gap-2 text-[#333333]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#20c997]" />
                  <span>CSV File</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Transactions exported to Excel!');
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9fa] flex items-center gap-2 text-[#333333]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#00a65a]" />
                  <span>Excel File</span>
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Transactions Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#dee2e6] text-[#333333] font-semibold bg-[#fafafa]">
                <th className="py-2.5 px-3">Id</th>
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3">Payment Id</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Currency</th>
                <th className="py-2.5 px-3">Payment Amount</th>
                <th className="py-2.5 px-3">Payment Status</th>
                <th className="py-2.5 px-3">Ip Address</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-[#888888]">
                    No transactions found
                  </td>
                </tr>
              ) : (
                displayedList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-2.5 px-3 text-[#555555]">{tx.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#333333]">
                      <Link href="/admin/orders" className="hover:text-[#00a99d]">
                        {tx.order}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-[#555555]">{tx.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-[#555555] font-mono text-[11.5px] max-w-[220px] truncate" title={tx.paymentId}>
                      {tx.paymentId}
                    </td>
                    <td className="py-2.5 px-3 text-[#333333] font-medium">{tx.user}</td>
                    <td className="py-2.5 px-3 text-[#555555]">{tx.currency}</td>
                    <td className="py-2.5 px-3 font-medium text-[#333333]">
                      {tx.paymentAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[#333333]">
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#555555] font-mono text-[11.5px]">{tx.ipAddress}</td>
                    <td className="py-2.5 px-3 text-[#555555] whitespace-nowrap">{tx.date}</td>
                    <td className="py-2.5 px-3 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === tx.id ? null : tx.id)}
                          className="px-2.5 py-1 bg-[#5b5394] hover:bg-[#4c457d] text-white text-[11.5px] font-medium rounded flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <span>Select an option</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {activeMenuId === tx.id && (
                          <div className="absolute right-3 mt-1 w-36 bg-white rounded border border-[#dee2e6] shadow-lg py-1 z-40 text-[12px] text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTx(tx);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9fa] flex items-center gap-2 text-[#333333]"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#00a99d]" />
                              <span>View Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tx.id)}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#fff5f5] flex items-center gap-2 text-[#dc3545]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-md max-w-md w-full shadow-2xl overflow-hidden border border-[#dee2e6]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#dee2e6]">
              <h3 className="font-bold text-[15px] text-[#333333]">Transaction Details</h3>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="text-[#888888] hover:text-[#222222]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">Transaction ID:</span>
                <span className="font-semibold text-[#333333]">#{selectedTx.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">Order:</span>
                <span className="font-bold text-[#00a99d]">{selectedTx.order}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">Payment Method:</span>
                <span className="font-medium text-[#333333]">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">Payment ID:</span>
                <span className="font-mono text-[11.5px] text-[#333333] break-all">{selectedTx.paymentId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">User:</span>
                <span className="font-medium text-[#333333]">{selectedTx.user}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">Amount:</span>
                <span className="font-bold text-[#00a99d]">{selectedTx.currency} {selectedTx.paymentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">Status:</span>
                <span className="font-semibold text-[#28a745]">{selectedTx.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f3f5]">
                <span className="text-[#777777]">IP Address:</span>
                <span className="font-mono text-[12px] text-[#555555]">{selectedTx.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#777777]">Date:</span>
                <span className="text-[#555555]">{selectedTx.date}</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-[#f8f9fa] border-t border-[#dee2e6] text-right">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-1.5 rounded bg-[#6c757d] text-white text-[12.5px] hover:bg-[#5a6268] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
