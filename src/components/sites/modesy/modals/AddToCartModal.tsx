'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModesy } from '@/context/ModesyContext';
import { CheckCircle2, X } from 'lucide-react';

export function AddToCartModal() {
  const { cartModalProduct, setCartModalProduct, currency } = useModesy();

  if (!cartModalProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => setCartModalProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[460px] rounded-lg bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => setCartModalProduct(null)}
          className="absolute top-4 right-4 p-1 text-[#888888] hover:text-[#222222] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="flex items-center gap-2.5 text-[#28a745] font-semibold text-base mb-4 pb-3 border-b border-[#e9ecef]">
          <CheckCircle2 className="w-5 h-5" />
          <span>Product successfully added to your cart!</span>
        </div>

        {/* Product Summary */}
        <div className="flex gap-4 items-center bg-[#f8f9fa] p-3 rounded-md mb-6">
          <div className="relative w-16 h-16 rounded overflow-hidden bg-white border border-[#dee2e6] flex-shrink-0">
            <Image
              src={cartModalProduct.image}
              alt={cartModalProduct.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#222222] truncate">
              {cartModalProduct.title}
            </h4>
            <p className="text-xs text-[#888888] mt-0.5">{cartModalProduct.sellerName}</p>
            <p className="text-sm font-bold text-[#00a99d] mt-1">
              {currency.symbol}
              {cartModalProduct.price}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCartModalProduct(null)}
            className="flex-1 py-2.5 px-4 rounded-full border border-[#dee2e6] hover:bg-[#f1f3f5] text-xs sm:text-sm font-semibold text-[#444444] transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
          <Link
            href="/cart"
            onClick={() => setCartModalProduct(null)}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#00a99d] hover:bg-[#008e84] text-xs sm:text-sm font-semibold text-white text-center transition-colors shadow-xs hover:shadow-md cursor-pointer"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
