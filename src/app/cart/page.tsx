'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModesy } from '@/context/ModesyContext';
import { ArrowLeft, X } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, currency } = useModesy();

  const currencyRate = currency.code === 'IDR' ? 16000 : 1;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + vat;

  // EMPTY CART SCREEN MATCHING MODESY .shopping-cart-empty
  if (cartItems.length === 0) {
    return (
      <div id="wrapper" className="bg-[#f8f9fa] min-h-[65vh] py-12">
        <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto">
          <div className="shopping-cart-empty py-16 text-center bg-white border border-[#eaeaef] rounded-[6px] shadow-xs">
            <p className="text-[17px] text-[#222222] mb-6">
              <strong className="font-semibold">Your cart is empty!</strong>
            </p>
            <Link
              href="/"
              className="btn btn-lg btn-custom inline-flex items-center gap-2 h-11 px-8 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Shop Now</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper" className="bg-[#f8f9fa] min-h-screen py-8">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto">
        <div className="shopping-cart mt-4 bg-white border border-[#eaeaef] rounded-[6px] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8">
              <div className="left border-b border-[#e5e5e5] pb-6">
                <h1 className="cart-section-title text-[18px] font-bold text-[#222222] border-b border-[#e5e5e5] pb-4 mb-6">
                  Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </h1>

                {/* Items List */}
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const unitPrice = Math.round((item.product.price || 0) * currencyRate).toLocaleString();
                    const lineTotal = Math.round((item.product.price || 0) * item.quantity * currencyRate).toLocaleString();

                    return (
                      <div
                        key={item.product.id}
                        className="item flex flex-col sm:flex-row items-start gap-4 pb-6 border-b border-[#f1f3f5] last:border-b-0"
                      >
                        {/* 130px Thumbnail */}
                        <div className="cart-item-image w-[110px] sm:w-[130px] flex-shrink-0">
                          <Link
                            href={`/${item.product.slug}`}
                            className="block relative aspect-square w-full rounded-[4px] border border-[#eaeaef] overflow-hidden bg-[#fafafa]"
                          >
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="130px"
                            />
                          </Link>
                        </div>

                        {/* Details */}
                        <div className="cart-item-details flex-1 min-w-0 space-y-1.5 text-xs text-[#444444]">
                          <div className="list-item">
                            <Link
                              href={`/${item.product.slug}`}
                              className="product-title text-[14px] font-semibold text-[#222222] hover:text-[#00a99d] transition-colors line-clamp-2"
                            >
                              {item.product.title}
                            </Link>
                          </div>

                          <div className="list-item seller text-[12.5px] text-[#5d5d5d]">
                            By:&nbsp;
                            <Link
                              href={`/products?seller=${encodeURIComponent(item.product.sellerSlug)}`}
                              className="font-semibold text-[#5d5d5d] hover:text-[#00a99d]"
                            >
                              {item.product.sellerName || 'Admin'}
                            </Link>
                          </div>

                          <div className="list-item flex items-center gap-2">
                            <span className="text-[#777777] min-w-[80px]">Unit Price:</span>
                            <strong className="lbl-price font-semibold text-[#222222]">
                              {currency.symbol}{unitPrice}
                            </strong>
                          </div>

                          <div className="list-item flex items-center gap-2">
                            <span className="text-[#777777] min-w-[80px]">Total:</span>
                            <strong className="lbl-price font-semibold text-[#00a99d]">
                              {currency.symbol}{lineTotal}
                            </strong>
                          </div>

                          {/* Remove Button matching Modesy .btn-outline-gray */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="btn btn-outline-gray h-8 px-3.5 rounded-[3px] border border-[#e5e5e5] hover:border-[#bcbcbc] text-[#444444] text-xs font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5 text-[#666666]" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Quantity Spinner matching Modesy .number-spinner */}
                        <div className="cart-item-quantity sm:w-[126px] flex-shrink-0">
                          <div className="number-spinner inline-flex items-center h-[42px] w-[120px] border border-[#e0e0e0] rounded-[3px] bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  addToCart({ ...item.product, price: item.product.price });
                                } else {
                                  removeFromCart(item.product.id);
                                }
                              }}
                              className="w-9 h-full flex items-center justify-center text-[#555555] hover:bg-[#f5f5f5] text-base font-bold border-r border-[#e0e0e0] cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              readOnly
                              value={item.quantity}
                              className="flex-1 h-full text-center text-xs font-semibold text-[#222222] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => addToCart(item.product)}
                              className="w-9 h-full flex items-center justify-center text-[#555555] hover:bg-[#f5f5f5] text-base font-bold border-l border-[#e0e0e0] cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Keep Shopping Button */}
              <div className="mt-6">
                <Link
                  href="/"
                  className="btn btn-md btn-custom inline-flex items-center gap-2 h-10 px-6 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-xs transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Keep Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary matching Modesy .shopping-cart .right */}
            <div className="lg:col-span-4">
              <div className="right bg-[#f9f9f9] border border-[#eee] rounded-[4px] p-6 sm:p-7 space-y-4">
                <div className="space-y-3 text-xs text-[#555555]">
                  <div className="cost-item flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#222222]">
                      {currency.symbol}{Math.round(subtotal * currencyRate).toLocaleString()}
                    </span>
                  </div>

                  <div className="cost-item flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#222222]">
                      {shipping === 0 ? 'FREE' : `${currency.symbol}${Math.round(shipping * currencyRate).toLocaleString()}`}
                    </span>
                  </div>

                  <div className="cost-item flex justify-between items-center">
                    <span>Vat (5%)</span>
                    <span className="font-semibold text-[#222222]">
                      {currency.symbol}{Math.round(vat * currencyRate).toLocaleString()}
                    </span>
                  </div>

                  {/* Line Separator matching Modesy .line-seperator */}
                  <div className="line-seperator bg-[#e0e0e0] h-[1px] my-3 w-full" />

                  <div className="cost-item total flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold text-[#222222]">Total</span>
                    <span className="text-lg font-bold text-[#00a99d]">
                      {currency.symbol}{Math.round(total * currencyRate).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Continue to Checkout button */}
                <Link
                  href="/cart/shipping"
                  className="btn btn-block btn-custom btn-continue-payment w-full h-11 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-sm flex items-center justify-center transition-colors shadow-xs"
                >
                  Continue to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
