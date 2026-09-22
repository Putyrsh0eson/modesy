'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I place an order on Modesy?',
      a: 'Browse our marketplace, select your preferred product options (color, size), and click "Add to Cart" or "Buy Now". Follow the checkout steps to select your shipping address and preferred payment method.'
    },
    {
      q: 'How can I become a seller on Modesy?',
      a: 'Click "Start Selling" in the top navigation bar, choose your membership plan, and set up your shop name and payout details. Once verified, you can immediately start uploading products.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support major credit cards (Visa, Mastercard, Amex via Stripe), PayPal, Bank Wire Transfer, Cash on Delivery, Midtrans, and Wallet Balance.'
    },
    {
      q: 'Can I track my order delivery?',
      a: 'Yes! Go to "My Orders" in your account dropdown or visit /orders. Click "Details" next to your order to see real-time dispatch and courier tracking numbers.'
    },
    {
      q: 'How do refunds and returns work?',
      a: 'If your item arrives damaged or does not match the description, you can open a Refund Request within 14 days from your order page. Our team and the vendor will assist you in resolving the issue.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Help Center</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">How can we help you?</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Find answers to commonly asked questions regarding buying, selling, payments, and shipping.
        </p>
      </div>

      {/* Quick Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-center space-y-2">
          <ShoppingCart className="w-6 h-6 text-indigo-600 mx-auto" />
          <h3 className="text-xs font-bold text-gray-800">Buying & Orders</h3>
          <p className="text-[11px] text-gray-500">Checkout, coupons, and order tracking</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-center space-y-2">
          <Truck className="w-6 h-6 text-emerald-600 mx-auto" />
          <h3 className="text-xs font-bold text-gray-800">Shipping & Delivery</h3>
          <p className="text-[11px] text-gray-500">Delivery times, fees, and couriers</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-center space-y-2">
          <ShieldCheck className="w-6 h-6 text-purple-600 mx-auto" />
          <h3 className="text-xs font-bold text-gray-800">Returns & Refunds</h3>
          <p className="text-[11px] text-gray-500">14-day buyer protection policy</p>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
        <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-xs font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-gray-500 leading-relaxed pt-2 animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Still need help banner */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-800">Still have questions?</p>
          <p className="text-[11px] text-gray-500">Our customer support team is ready to help you 24/7.</p>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-bold shadow-sm"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
