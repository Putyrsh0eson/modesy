'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModesy } from '@/context/ModesyContext';
import { submitOrder } from '@/lib/supabase';
import { Check, CheckCircle, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { Order } from '@/types/modesy';

export default function ShippingCheckoutPage() {
  const { cartItems, removeFromCart, currency, user, setLoginModalOpen } = useModesy();

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [paymentMethod, setPaymentMethod] = useState('midtrans');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  useEffect(() => {
    if (user) {
      setFullName(current => current || user.username);
      setEmail(current => current || user.email);
    }
  }, [user]);

  const currencyRate = currency.code === 'IDR' ? 16000 : 1;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const vat = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + shipping + vat - discountApplied);

  const paymentOptions = [
    { id: 'paypal', name: 'PayPal', logos: ['visa', 'mastercard', 'amex', 'discover', 'paypal'] },
    { id: 'stripe', name: 'Stripe', logos: ['visa', 'mastercard', 'amex', 'discover', 'jcb', 'stripe'] },
    { id: 'paystack', name: 'Paystack', logos: ['visa', 'mastercard', 'verve', 'paystack'] },
    { id: 'razorpay', name: 'Razorpay', logos: ['visa', 'mastercard', 'amex', 'maestro', 'rupay', 'razorpay'] },
    { id: 'flutterwave', name: 'Flutterwave', logos: ['visa', 'mastercard', 'amex', 'maestro', 'flutterwave'] },
    { id: 'iyzico', name: 'Iyzico', logos: ['visa', 'mastercard', 'amex', 'troy', 'iyzico'] },
    { id: 'midtrans', name: 'Midtrans', logos: ['visa', 'mastercard', 'amex', 'jcb', 'midtrans'] },
    { id: 'paytabs', name: 'PayTabs', logos: ['visa', 'mastercard', 'amex', 'discover', 'paytabs'] },
    { id: 'yoomoney', name: 'YooMoney', logos: ['visa', 'mastercard', 'maestro'], brand: 'МИР  Ю money' },
    { id: 'mercado_pago', name: 'Mercado Pago', logos: ['visa', 'mastercard', 'amex', 'discover', 'mercado_pago'] },
    { id: 'bank_transfer', name: 'Bank Transfer', logos: [], description: 'Make your payment directly into our bank account.' },
  ] as const;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'MODESY10') {
      setDiscountApplied(10);
    } else {
      alert('Coupon code invalid or expired. Try: MODESY10');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    if (!fullName || !email || !phone || !address || !city || !state || !zipCode || !country) {
      alert('Please fill all required shipping information.');
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await submitOrder({
        items: cartItems.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price || 0,
          quantity: item.quantity,
          image: item.product.image,
          sellerName: item.product.sellerName,
        })),
        subtotal,
        shipping,
        tax: vat,
        total,
        currency: currency.code,
        status: 'processing',
        customer: {
          fullName,
          email,
          phone,
          address: `${address}, ${city}, ${state} ${zipCode}`,
          city,
          country,
        },
        paymentMethod,
      });

      // Clear cart
      cartItems.forEach((item) => removeFromCart(item.product.id));
      setCompletedOrder(order);
    } catch (err) {
      console.error('Order error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div id="wrapper" className="bg-[#f8f9fa] min-h-[70vh] py-12">
        <div className="w-[94%] sm:w-[90%] lg:w-[90%] max-w-[750px] mx-auto bg-white border border-[#eaeaef] rounded-[6px] p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-[#222222]">Order Placed Successfully!</h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-2">
            Thank you for your order. We have registered order <strong className="text-[#00a99d]">{completedOrder.orderNumber}</strong> in the system.
          </p>

          <div className="my-6 p-5 rounded-[4px] bg-[#fafafa] border border-[#eee] text-left text-xs sm:text-sm space-y-2">
            <div className="flex justify-between font-semibold border-b border-[#eee] pb-2">
              <span>Order ID:</span>
              <span className="text-[#00a99d]">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Recipient:</span>
              <span>{completedOrder.customer.fullName} ({completedOrder.customer.email})</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Address:</span>
              <span>{completedOrder.customer.address}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{completedOrder.paymentMethod.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#eee]">
              <span>Total Paid:</span>
              <span className="text-[#00a99d]">
                {currency.symbol}{Math.round(completedOrder.total * currencyRate).toLocaleString()}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-8 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-xs transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div id="wrapper" className="bg-[#f8f9fa] min-h-[60vh] py-16">
        <div className="w-[94%] sm:w-[90%] lg:w-[90%] max-w-[600px] mx-auto bg-white border border-[#eaeaef] rounded-[6px] p-10 text-center shadow-xs">
          <p className="text-[17px] text-[#222222] font-semibold mb-5">Your cart is empty!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-[3px] bg-[#00a99d] text-white font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper" className="bg-[#f8f9fa] min-h-screen py-8">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto">
        {/* Navigation / Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="text-xs font-semibold text-[#00a99d] hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Steps matching Modesy .tab-checkout */}
          <div className="lg:col-span-8 space-y-4">
            {/* Step 1: Shipping Information */}
            <div className="tab-checkout bg-white border border-[#eaeaef] rounded-[6px] overflow-hidden shadow-xs">
              <div
                onClick={() => setActiveStep(1)}
                className={`p-5 flex items-center justify-between border-b cursor-pointer transition-colors ${
                  activeStep === 1 ? 'bg-white border-[#eaeaef]' : 'bg-[#f9f9f9] border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00a99d] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-[#222222]">Shipping Information</h2>
                </div>
                {activeStep !== 1 && (
                  <span className="text-xs text-[#00a99d] font-semibold">Edit</span>
                )}
              </div>

              {activeStep === 1 && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 812-3456-7890"
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d] bg-white"
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street name, house/apartment number"
                      className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Jakarta"
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">State / Province</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="DKI Jakarta"
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">Zip Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="12340"
                        className="w-full h-10 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName || !email || !phone || !address || !city || !state || !zipCode || !country) {
                          alert('Please fill in all shipping information before continuing to payment.');
                          return;
                        }
                        setActiveStep(2);
                      }}
                      className="h-10 px-6 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-xs cursor-pointer"
                    >
                      Continue to Payment &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="tab-checkout bg-white border border-[#eaeaef] rounded-[6px] overflow-hidden shadow-xs">
              <div
                onClick={() => setActiveStep(2)}
                className={`p-5 flex items-center justify-between border-b cursor-pointer transition-colors ${
                  activeStep === 2 ? 'bg-white border-[#eaeaef]' : 'bg-[#f9f9f9] border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00a99d] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-[#222222]">Payment Method</h2>
                </div>
              </div>

              {activeStep === 2 && (
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    {paymentOptions.map((option) => {
                      const isSelected = paymentMethod === option.id;

                      return (
                        <label
                          key={option.id}
                          className={`flex min-h-[58px] cursor-pointer items-center justify-between gap-4 rounded-[7px] border-2 bg-white px-4 py-3 text-sm font-medium transition-colors ${
                            isSelected
                              ? 'border-[#00a99d] text-[#222222]'
                              : 'border-[#d5d5d5] text-[#222222] hover:border-[#a9a9a9]'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-5">
                            <span className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? 'border-[#00a99d] bg-[#00a99d] text-white'
                                : 'border-[#cfcfcf] bg-white'
                            }`}>
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </span>
                            <input
                              type="radio"
                              name="payment"
                              value={option.id}
                              checked={isSelected}
                              onChange={() => setPaymentMethod(option.id)}
                              className="sr-only"
                            />
                            <span className="min-w-0">
                              <span className="block">{option.name}</span>
                              {'description' in option && (
                                <span className="mt-0.5 block text-xs font-normal text-[#777777]">{option.description}</span>
                              )}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2.5">
                            {option.logos.map((logo) => (
                              <Image
                                key={logo}
                                src={`/images/payment/${logo}.svg`}
                                alt={logo}
                                width={logo === 'midtrans' ? 91 : 52}
                                height={22}
                                className="h-[22px] w-auto max-w-[91px]"
                              />
                            ))}
                            {'brand' in option && (
                              <span className="whitespace-nowrap text-base font-semibold text-[#1b8f72]">{option.brand}</span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                    <p className="text-xs text-[#666666]">
                      You will complete your payment securely through {paymentOptions.find((option) => option.id === paymentMethod)?.name} after confirming your order.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f1f3f5]">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handlePlaceOrder}
                      className="w-full h-11 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-sm flex items-center justify-center transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing Payment...' : `Pay with ${paymentOptions.find((option) => option.id === paymentMethod)?.name}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Details matching Modesy .cart-order-details */}
          <div className="lg:col-span-4 bg-white border border-[#eaeaef] rounded-[6px] p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-[#222222] border-b border-[#eeeeee] pb-3">
              Order Details
            </h3>

            {/* Products mini list */}
            <div className="cart-order-details divide-y divide-[#f1f3f5]">
              {cartItems.map((item) => (
                <div key={item.product.id} className="item py-3 first:pt-0 last:pb-0 flex gap-3">
                  <div className="item-left w-16 h-16 flex-shrink-0 relative rounded-[3px] border border-[#eaeaef] overflow-hidden bg-[#fafafa]">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="item-right flex-1 min-w-0 text-xs">
                    <div className="list-item font-semibold text-[#222222] truncate">
                      {item.product.title}
                    </div>
                    <div className="text-[#777777] mt-0.5">
                      Quantity: <span className="font-semibold text-[#333]">{item.quantity}</span>
                    </div>
                    <div className="text-[#00a99d] font-semibold mt-1">
                      {currency.symbol}{Math.round((item.product.price || 0) * item.quantity * currencyRate).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Coupon matching Modesy .cart-discount-coupon */}
            <form onSubmit={handleApplyCoupon} className="cart-discount-coupon flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Discount Coupon"
                className="flex-1 h-9 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-[3px] bg-[#444444] hover:bg-[#222222] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-[#555555] pt-3 border-t border-[#f1f3f5]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#222222]">
                  {currency.symbol}{Math.round(subtotal * currencyRate).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#222222]">
                  {shipping === 0 ? 'FREE' : `${currency.symbol}${Math.round(shipping * currencyRate).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Vat (5%)</span>
                <span className="font-semibold text-[#222222]">
                  {currency.symbol}{Math.round(vat * currencyRate).toLocaleString()}
                </span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{currency.symbol}{Math.round(discountApplied * currencyRate).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#222222] pt-2 border-t border-[#eee]">
                <span>Total</span>
                <span className="text-[#00a99d]">
                  {currency.symbol}{Math.round(total * currencyRate).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Badges */}
            <div className="pt-3 border-t border-[#f1f3f5] space-y-1.5 text-[11px] text-[#777777]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a99d]" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#00a99d]" />
                <span>Tracked Courier Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
