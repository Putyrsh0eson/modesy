'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModesy } from '@/context/ModesyContext';
import { marketplaceStore } from '@/services/marketplaceStore';
import { Plus, X, Check, ArrowDownLeft, ArrowUpRight, CreditCard, Building, ShieldCheck, QrCode, WalletCards } from 'lucide-react';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: () => void;
        onPending?: () => void;
        onError?: () => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

interface WalletEarningRecord {
  orderNumber: string;
  total: number;
  currency: string;
  vat: number;
  commission: number;
  commissionRate: number;
  referrerCommission: number;
  referralDiscount: number;
  couponDiscount: number;
  shippingCost: number;
  earnedAmount: number;
  date: string;
}

interface DepositRecord {
  id: number;
  depositNumber: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'Completed' | 'Pending';
  date: string;
}

interface ExpenseRecord {
  id: number;
  orderNumber: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

interface PayoutRecord {
  id: number;
  method: string;
  amount: number;
  currency: string;
  status: 'Completed' | 'Pending';
  date: string;
}

export default function WalletPage() {
  const { user } = useModesy();
  const [activeTab, setActiveTab] = useState<'earnings' | 'deposits' | 'expenses' | 'payouts' | 'set_payout'>('earnings');
  const [balance, setBalance] = useState<number>(1465);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('50');
  const [depositMethod, setDepositMethod] = useState('bank_transfer');
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [isDepositProcessing, setIsDepositProcessing] = useState(false);

  // Initial Earnings matching Screenshot 2 exactly
  const [earnings, setEarnings] = useState<WalletEarningRecord[]>([
    {
      orderNumber: '10010',
      total: 19.00,
      currency: 'USD',
      vat: 0,
      commission: 0.95,
      commissionRate: 5,
      referrerCommission: 0,
      referralDiscount: 0,
      couponDiscount: 0,
      shippingCost: 0,
      earnedAmount: 18.05,
      date: '2026-08-31 / 17:37',
    },
    {
      orderNumber: '10009',
      total: 100.00,
      currency: 'USD',
      vat: 0,
      commission: 5.00,
      commissionRate: 5,
      referrerCommission: 0,
      referralDiscount: 0,
      couponDiscount: 0,
      shippingCost: 10,
      earnedAmount: 105.00,
      date: '2026-08-05 / 14:08',
    },
    {
      orderNumber: '10006',
      total: 160.00,
      currency: 'USD',
      vat: 0,
      commission: 24.00,
      commissionRate: 15,
      referrerCommission: 0,
      referralDiscount: 0,
      couponDiscount: 0,
      shippingCost: 10,
      earnedAmount: 146.00,
      date: '2026-08-05 / 13:48',
    },
    {
      orderNumber: '10005',
      total: 49.00,
      currency: 'USD',
      vat: 0,
      commission: 2.45,
      commissionRate: 5,
      referrerCommission: 2.45,
      referralDiscount: 2.45,
      couponDiscount: 0,
      shippingCost: 10,
      earnedAmount: 51.65,
      date: '2026-08-05 / 13:46',
    },
    {
      orderNumber: '10004',
      total: 150.00,
      currency: 'USD',
      vat: 0,
      commission: 22.50,
      commissionRate: 15,
      referrerCommission: 7.50,
      referralDiscount: 7.50,
      couponDiscount: 0,
      shippingCost: 10,
      earnedAmount: 122.50,
      date: '2026-08-05 / 13:21',
    },
  ]);

  const [deposits, setDeposits] = useState<DepositRecord[]>([
    { id: 1, depositNumber: 'DEP-849102', paymentMethod: 'Stripe', amount: 500, currency: 'USD', status: 'Completed', date: '2026-09-01 / 10:15' },
    { id: 2, depositNumber: 'DEP-739105', paymentMethod: 'PayPal', amount: 250, currency: 'USD', status: 'Completed', date: '2026-08-15 / 14:20' },
  ]);

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([
    { id: 1, orderNumber: '#10019', amount: 182.10, currency: 'USD', description: 'Order payment via Wallet Balance', date: '2026-09-09 / 11:39' },
    { id: 2, orderNumber: '#10018', amount: 149.50, currency: 'USD', description: 'Order payment via Wallet Balance', date: '2026-09-09 / 05:59' },
    { id: 3, orderNumber: '#10016', amount: 84.00, currency: 'USD', description: 'Order payment via Wallet Balance', date: '2026-09-06 / 02:15' },
  ]);

  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    { id: 1, method: 'PayPal (vendor@modesy.com)', amount: 250.00, currency: 'USD', status: 'Completed', date: '2026-08-20 / 11:00' },
    { id: 2, method: 'Bank Transfer (Chase Bank)', amount: 500.00, currency: 'USD', status: 'Completed', date: '2026-07-28 / 09:30' },
  ]);

  // Form state for Payout Account
  const [payoutMethod, setPayoutMethod] = useState<'paypal' | 'bank' | 'swift'>('paypal');
  const [paypalEmail, setPaypalEmail] = useState(user?.email || 'vendor@modesy.com');
  const [bankFullName, setBankFullName] = useState('Trendshop Store Inc.');
  const [bankName, setBankName] = useState('Chase Manhattan Bank');
  const [accountNumber, setAccountNumber] = useState('982736418293');
  const [iban, setIban] = useState('US89CHAS98273641829300');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const walletStorageKey = `modesy_wallet_${user?.id || user?.email || 'guest'}`;

  useEffect(() => {
    try {
      const savedWallet = localStorage.getItem(walletStorageKey);
      if (savedWallet) {
        const parsed = JSON.parse(savedWallet) as { balance?: number; deposits?: DepositRecord[] };
        if (typeof parsed.balance === 'number') setBalance(parsed.balance);
        if (Array.isArray(parsed.deposits)) setDeposits(parsed.deposits);
      }
    } catch {
      // Use the default wallet when stored data is unavailable.
    }
  }, [walletStorageKey]);

  useEffect(() => {
    const scriptId = 'midtrans-wallet-snap-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Sync dynamically with marketplaceStore
  useEffect(() => {
    const syncFromStore = () => {
      const orders = marketplaceStore.getOrders();
      // Calculate dynamic balance from completed sales and deposits
      const newOrdersEarnings: WalletEarningRecord[] = orders.slice(0, 5).map(o => {
        const saleAmount = typeof o.total === 'number' ? o.total : parseFloat(String(o.total)) || 0;
        const comm = parseFloat((saleAmount * 0.10).toFixed(2));
        const earned = parseFloat((saleAmount - comm).toFixed(2));
        return {
          orderNumber: o.orderNumber.replace('#', ''),
          total: saleAmount,
          currency: o.currency || 'USD',
          vat: 0,
          commission: comm,
          commissionRate: 10,
          referrerCommission: 0,
          referralDiscount: 0,
          couponDiscount: 0,
          shippingCost: 0,
          earnedAmount: earned,
          date: o.createdAt || '2026-09-14 / 16:27',
        };
      });

      // Combine preset reference rows with latest orders
      if (newOrdersEarnings.length > 0) {
        setEarnings([
          ...newOrdersEarnings.filter(ne => !['10010', '10009', '10006', '10005', '10004'].includes(ne.orderNumber)),
          ...earnings.filter(e => ['10010', '10009', '10006', '10005', '10004'].includes(e.orderNumber))
        ]);
      }
    };

    syncFromStore();
    return marketplaceStore.subscribe(syncFromStore);
  }, []);

  const handleAddFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val < 10) {
      setDepositError('Minimum Deposit Amount: $10');
      return;
    }
    setDepositError('');
    if (!window.snap) {
      setDepositError('Midtrans is still loading. Please try again in a moment.');
      return;
    }

    setIsDepositProcessing(true);
    try {
      const orderId = `WALLET-${Date.now()}`;
      const response = await fetch('/api/payments/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          grossAmount: Math.round(val * 16000),
          customer: {
            firstName: user?.username || 'Modesy Customer',
            email: user?.email,
          },
        }),
      });
      const result = await response.json() as { token?: string; error?: string };
      if (!response.ok || !result.token) throw new Error(result.error || 'Unable to start payment.');

      window.snap.pay(result.token, {
        onSuccess: () => {
          const nextBalance = balance + val;
          const nextDeposits: DepositRecord[] = [{
            id: Date.now(),
            depositNumber: orderId,
            paymentMethod: depositMethod === 'bank_transfer'
              ? 'Bank Transfer / Virtual Account'
              : depositMethod === 'card'
                ? 'Credit / Debit Card'
                : depositMethod === 'qris'
                  ? 'QRIS / Midtrans Instant Pay'
                  : 'PayPal Account',
            amount: val,
            currency: 'USD',
            status: 'Completed',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }, ...deposits];
          setBalance(nextBalance);
          setDeposits(nextDeposits);
          localStorage.setItem(walletStorageKey, JSON.stringify({ balance: nextBalance, deposits: nextDeposits }));
          setDepositSuccess(true);
          setIsDepositProcessing(false);
        },
        onPending: () => setIsDepositProcessing(false),
        onError: () => {
          setDepositError('Payment failed. Please try again.');
          setIsDepositProcessing(false);
        },
        onClose: () => setIsDepositProcessing(false),
      });
    } catch (error) {
      setDepositError(error instanceof Error ? error.message : 'Unable to start payment.');
      setIsDepositProcessing(false);
    }
  };

  const handleSavePayoutAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4 py-6 font-sans text-[#414456]">
      {/* Breadcrumb matching Modesy */}
      <nav className="text-[12.5px] text-[#777777] flex items-center gap-1.5 mb-2">
        <Link href="/" className="hover:text-[#00a99d] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[#333333] font-medium">Wallet</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-[26px] font-bold text-[#203145] mb-6">Wallet</h1>

      {/* Wallet Balance Card (Pixel-Perfect to Screenshot 2) */}
      <div className="max-w-[540px] mx-auto mb-8 bg-white border border-[#eef0f3] rounded-[6px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative text-center">
        {/* Top Right Add Funds Button */}
        <button
          type="button"
          onClick={() => setIsAddFundsOpen(true)}
          className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f9fa] hover:bg-gray-100 border border-[#dee2e6] rounded-[4px] text-[12px] font-semibold text-[#444444] transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#00a99d]" />
          <span>Add Funds</span>
        </button>

        {/* Center SVG Wallet Icon */}
        <div className="flex justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0z" />
              <path
                fill="#00a99d"
                d="M5 6.5a.5.5 0 0 1 .5-.5H16a1 1 0 1 0 0-2H5.5A2.5 2.5 0 0 0 3 6.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5.5a.5.5 0 0 1-.5-.5M15.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
              />
            </g>
          </svg>
        </div>

        {/* Label */}
        <div className="text-[13.5px] font-semibold text-[#666666] mb-1">Wallet Balance</div>

        {/* Total Price */}
        <div className="text-[32px] font-bold text-[#203145] tracking-tight">
          ${balance.toLocaleString()}
        </div>
      </div>

      {/* Tabs Row (Pixel-Perfect to Screenshot 2) */}
      <div className="flex flex-wrap items-center justify-center gap-1 mb-6 border-b border-[#e9ecef] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          className={`px-5 py-2 text-[13px] font-medium rounded-[4px] transition-colors cursor-pointer ${
            activeTab === 'earnings'
              ? 'bg-[#00a99d] text-white shadow-2xs'
              : 'bg-transparent text-[#555555] hover:bg-gray-100'
          }`}
        >
          Earnings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deposits')}
          className={`px-5 py-2 text-[13px] font-medium rounded-[4px] transition-colors cursor-pointer ${
            activeTab === 'deposits'
              ? 'bg-[#00a99d] text-white shadow-2xs'
              : 'bg-transparent text-[#555555] hover:bg-gray-100'
          }`}
        >
          Deposits
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`px-5 py-2 text-[13px] font-medium rounded-[4px] transition-colors cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-[#00a99d] text-white shadow-2xs'
              : 'bg-transparent text-[#555555] hover:bg-gray-100'
          }`}
        >
          Expenses
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payouts')}
          className={`px-5 py-2 text-[13px] font-medium rounded-[4px] transition-colors cursor-pointer ${
            activeTab === 'payouts'
              ? 'bg-[#00a99d] text-white shadow-2xs'
              : 'bg-transparent text-[#555555] hover:bg-gray-100'
          }`}
        >
          Payouts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('set_payout')}
          className={`px-5 py-2 text-[13px] font-medium rounded-[4px] transition-colors cursor-pointer ${
            activeTab === 'set_payout'
              ? 'bg-[#00a99d] text-white shadow-2xs'
              : 'bg-transparent text-[#555555] hover:bg-gray-100'
          }`}
        >
          Set Payout Account
        </button>
      </div>

      {/* Tab 1: Earnings (Exact Table from Screenshot 2) */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-[6px] border border-[#eef0f3] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead className="bg-[#fcfcfd] border-b border-[#eef0f3] text-[#444444] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">VAT</th>
                  <th className="py-3.5 px-4">Commissions & Discounts</th>
                  <th className="py-3.5 px-4">Shipping Cost</th>
                  <th className="py-3.5 px-4">Earned Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f5] text-[#414456]">
                {earnings.map((row, idx) => (
                  <tr key={`${row.orderNumber}-${idx}`} className="hover:bg-[#fafbfc] transition-colors">
                    {/* Order */}
                    <td className="py-3.5 px-4 font-semibold text-[#203145]">
                      #{row.orderNumber}
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-medium">
                      ${row.total.toFixed(0)} ({row.currency})
                    </td>

                    {/* VAT */}
                    <td className="py-3.5 px-4 text-[#666666]">
                      ${row.vat}
                    </td>

                    {/* Commissions & Discounts */}
                    <td className="py-3.5 px-4 space-y-0.5 text-[12px]">
                      <div>
                        Commission: <span className="text-[#dc3545]">${row.commission.toFixed(2)} ({row.commissionRate}%)</span>
                      </div>
                      <div>
                        Referrer Commission: <span className="text-[#dc3545]">${row.referrerCommission} (0%)</span>
                      </div>
                      <div>
                        Referral Discount: <span className="text-[#dc3545]">${row.referralDiscount} (0%)</span>
                      </div>
                      <div>
                        Discount Coupon: <span className="text-[#dc3545]">${row.couponDiscount}</span>
                      </div>
                    </td>

                    {/* Shipping Cost */}
                    <td className="py-3.5 px-4 text-[#666666]">
                      ${row.shippingCost}
                    </td>

                    {/* Earned Amount (Bold Green Text matching Screenshot 2) */}
                    <td className="py-3.5 px-4 font-bold text-[#28a745]">
                      ${row.earnedAmount.toFixed(2)} ({row.currency})
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#777777] text-[12px] whitespace-nowrap">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Deposits */}
      {activeTab === 'deposits' && (
        <div className="bg-white rounded-[6px] border border-[#eef0f3] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f5]">
            <div>
              <h3 className="font-bold text-[15px] text-[#203145]">Deposit History</h3>
              <p className="text-xs text-[#777777]">All completed wallet top-ups and balance loads</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddFundsOpen(true)}
              className="px-3 py-1.5 bg-[#00a99d] hover:bg-[#008e84] text-white text-xs font-semibold rounded-[4px] transition-colors"
            >
              + Deposit Funds
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead className="bg-[#fcfcfd] border-b border-[#eef0f3] text-[#444444] font-semibold">
                <tr>
                  <th className="py-3 px-4">Deposit #</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f5]">
                {deposits.map(dep => (
                  <tr key={dep.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-[#203145]">{dep.depositNumber}</td>
                    <td className="py-3 px-4 text-[#555555]">{dep.paymentMethod}</td>
                    <td className="py-3 px-4 font-bold text-[#28a745]">+${dep.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {dep.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#777777] text-[12px]">{dep.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-[6px] border border-[#eef0f3] shadow-sm p-5 space-y-4">
          <div className="pb-3 border-b border-[#f1f3f5]">
            <h3 className="font-bold text-[15px] text-[#203145]">Wallet Expenses</h3>
            <p className="text-xs text-[#777777]">Purchases paid using your wallet balance</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead className="bg-[#fcfcfd] border-b border-[#eef0f3] text-[#444444] font-semibold">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f5]">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-[#203145]">{exp.orderNumber}</td>
                    <td className="py-3 px-4 text-[#555555]">{exp.description}</td>
                    <td className="py-3 px-4 font-bold text-[#dc3545]">-${exp.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-[#777777] text-[12px]">{exp.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Payouts */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-[6px] border border-[#eef0f3] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f5]">
            <div>
              <h3 className="font-bold text-[15px] text-[#203145]">Payout Requests</h3>
              <p className="text-xs text-[#777777]">Withdrawals sent to your external account</p>
            </div>
            <button
              type="button"
              onClick={() => alert(`Your current balance of $${balance} is ready for withdrawal. Minimum payout is $50.`)}
              className="px-3 py-1.5 bg-[#00a99d] hover:bg-[#008e84] text-white text-xs font-semibold rounded-[4px] transition-colors"
            >
              Request Payout
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead className="bg-[#fcfcfd] border-b border-[#eef0f3] text-[#444444] font-semibold">
                <tr>
                  <th className="py-3 px-4">Id</th>
                  <th className="py-3 px-4">Method & Account</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f5]">
                {payouts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-[#777777]">#{p.id}</td>
                    <td className="py-3 px-4 text-[#333333] font-medium">{p.method}</td>
                    <td className="py-3 px-4 font-bold text-[#203145]">${p.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#777777] text-[12px]">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Set Payout Account */}
      {activeTab === 'set_payout' && (
        <div className="bg-white rounded-[6px] border border-[#eef0f3] shadow-sm p-6 max-w-xl mx-auto">
          <h3 className="font-bold text-[16px] text-[#203145] mb-1">Set Payout Account</h3>
          <p className="text-xs text-[#777777] mb-6">Choose how you wish to receive seller and commission payouts</p>

          {savedSuccess && (
            <div className="p-3 mb-5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Your payout account details have been saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSavePayoutAccount} className="space-y-4">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPayoutMethod('paypal')}
                className={`p-3 rounded border text-center text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  payoutMethod === 'paypal' ? 'border-[#00a99d] bg-teal-50/40 text-[#00a99d]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod('bank')}
                className={`p-3 rounded border text-center text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  payoutMethod === 'bank' ? 'border-[#00a99d] bg-teal-50/40 text-[#00a99d]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>Bank Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod('swift')}
                className={`p-3 rounded border text-center text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  payoutMethod === 'swift' ? 'border-[#00a99d] bg-teal-50/40 text-[#00a99d]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span>SWIFT</span>
              </button>
            </div>

            {payoutMethod === 'paypal' && (
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">PayPal Email Address</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full h-10 px-3 border border-[#dcdfe6] rounded text-sm text-[#333333] focus:outline-none focus:border-[#00a99d]"
                />
              </div>
            )}

            {payoutMethod === 'bank' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Account Holder Full Name</label>
                  <input
                    type="text"
                    value={bankFullName}
                    onChange={(e) => setBankFullName(e.target.value)}
                    required
                    className="w-full h-10 px-3 border border-[#dcdfe6] rounded text-sm text-[#333333] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className="w-full h-10 px-3 border border-[#dcdfe6] rounded text-sm text-[#333333] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    className="w-full h-10 px-3 border border-[#dcdfe6] rounded text-sm text-[#333333] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>
              </div>
            )}

            {payoutMethod === 'swift' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">IBAN / SWIFT Code</label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    required
                    className="w-full h-10 px-3 border border-[#dcdfe6] rounded text-sm text-[#333333] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-10 bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-sm rounded transition-colors shadow-2xs mt-4 cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Add Funds Modal */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={() => setIsAddFundsOpen(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-[5px] border border-[#d8d8d8] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4">
              <h3 className="font-bold text-[17px] text-[#222222]">Add Funds to Wallet</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-[#777777]">Deposit funds to pay for your orders instantly without re-entering payment info.</p>
              <button
                type="button"
                onClick={() => setIsAddFundsOpen(false)}
                className="absolute right-3 top-2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close add funds dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {depositSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#203145]">Funds Added Successfully!</h4>
                <p className="text-xs text-gray-500">Your wallet balance has been topped up by ${depositAmount}.</p>
                <button type="button" onClick={() => { setDepositSuccess(false); setIsAddFundsOpen(false); }} className="mt-3 h-9 px-5 rounded bg-[#00a99d] text-white text-xs font-semibold">Done</button>
              </div>
            ) : (
              <form onSubmit={handleAddFundsSubmit} className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#333333] mb-1.5">Quick Select Amount:</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[10, 25, 50, 100].map((amount) => (
                      <button key={amount} type="button" onClick={() => setDepositAmount(String(amount))} className={`h-8 rounded border text-xs font-semibold ${depositAmount === String(amount) ? 'border-[#00a99d] bg-[#00a99d] text-white' : 'border-[#e1e1e1] bg-[#fafafa] text-[#555555]'}`}>
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <label className="block text-[11px] font-semibold text-[#333333] mb-1.5">Or Enter Custom Amount ($) *</label>
                  <div className="flex h-9 border border-[#dcdfe6] rounded-[3px] overflow-hidden">
                    <span className="flex w-9 items-center justify-center bg-[#f1f2f4] text-xs font-semibold text-[#333333]">$</span>
                    <input
                      type="number"
                      min="10"
                      step="1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      required
                      className="w-full px-3 text-xs text-[#333333] focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-[#555555]">Minimum Deposit Amount: <strong>$10</strong></p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#333333] mb-1.5">Payment Method:</label>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setDepositMethod('bank_transfer')}
                      className={`w-full p-2.5 rounded border text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        depositMethod === 'bank_transfer' ? 'border-[#00a99d] bg-teal-50/60 text-[#333333]' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Building className="w-4 h-4 text-[#00a99d]" /> Bank Transfer / Virtual Account
                      <span className="ml-auto">{depositMethod === 'bank_transfer' ? '●' : '○'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositMethod('card')}
                      className={`w-full p-2.5 rounded border text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        depositMethod === 'card' ? 'border-[#00a99d] bg-teal-50/60 text-[#333333]' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#777777]" /> Credit / Debit Card
                      <span className="ml-auto">{depositMethod === 'card' ? '●' : '○'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositMethod('qris')}
                      className={`w-full p-2.5 rounded border text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        depositMethod === 'qris' ? 'border-[#00a99d] bg-teal-50/60 text-[#333333]' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#777777]" /> QRIS / Midtrans Instant Pay
                      <span className="ml-auto">{depositMethod === 'qris' ? '●' : '○'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositMethod('paypal')}
                      className={`w-full p-2.5 rounded border text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        depositMethod === 'paypal' ? 'border-[#00a99d] bg-teal-50/60 text-[#333333]' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <WalletCards className="w-4 h-4 text-[#777777]" /> PayPal Account
                      <span className="ml-auto">{depositMethod === 'paypal' ? '●' : '○'}</span>
                    </button>
                  </div>
                </div>

                {depositError && <p className="text-xs font-medium text-rose-600">{depositError}</p>}

                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddFundsOpen(false)} className="h-9 px-4 rounded border border-[#dddddd] text-xs font-semibold text-[#666666]">Cancel</button>
                  <button
                    type="submit"
                    disabled={isDepositProcessing}
                    className="h-9 px-4 bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-xs rounded transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
                  >
                    {isDepositProcessing ? 'Processing...' : `Deposit $${parseFloat(depositAmount || '0').toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
