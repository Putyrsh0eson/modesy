'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Minus, X, Star } from 'lucide-react';
import { marketplaceStore } from '@/services/marketplaceStore';

export default function VendorDashboardPage() {
  const [sales, setSales] = useState(() => marketplaceStore.getVendorSales('trendshop'));
  const [products, setProducts] = useState(() => marketplaceStore.getProducts());
  const [reviews, setReviews] = useState(() => marketplaceStore.getReviews());
  const [comments, setComments] = useState(() => marketplaceStore.getComments());

  useEffect(() => {
    const unsubscribe = marketplaceStore.subscribe(() => {
      setSales(marketplaceStore.getVendorSales('trendshop'));
      setProducts(marketplaceStore.getProducts());
      setReviews(marketplaceStore.getReviews());
      setComments(marketplaceStore.getComments());
    });
    return unsubscribe;
  }, []);

  const totalSalesCount = sales.length;
  const totalBalance = sales.reduce((acc, s) => acc + s.totalPrice, 0);
  const productsCount = products.length;
  const pendingProductsCount = products.filter(p => p.status === 'pending').length;

  const activeSalesCount = sales.filter(s => s.orderStatus === 'processing' || s.orderStatus === 'shipped').length;
  const completedSalesCount = sales.filter(s => s.orderStatus === 'completed').length;

  const latestSales = sales.slice(0, 5).map(s => ({
    sale: `#${s.orderNumber}`,
    status: s.orderStatus === 'completed' ? 'Completed' : s.orderStatus === 'shipped' ? 'Shipped' : 'Processing',
    payment: s.paymentStatus === 'paid' ? 'Payment Received' : 'Pending Payment',
    date: s.createdAt,
    orderNumber: s.orderNumber
  }));

  const latestReviews = reviews.map(r => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    product: r.productTitle,
    productSlug: r.productSlug,
    date: r.date
  }));

  const latestComments = comments.map(c => ({
    id: c.id,
    comment: c.comment,
    product: c.productTitle,
    productSlug: c.productSlug,
    date: c.date
  }));

  return (
    <div className="space-y-6 text-[#414456]">
      {/* 4 KPI Metric Cards in a single connected block */}
      <div className="bg-white rounded shadow-[0_2px_4px_rgba(0,0,0,0.03)] border border-[#eef0f3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#f1f6f9]">
        {/* Card 1: Total Sales */}
        <div className="p-6 relative flex flex-col justify-between">
          <div>
            <h3 className="text-[28px] font-bold text-[#203145] leading-none mb-1.5">
              {totalSalesCount}
            </h3>
            <span className="text-[13px] text-[#9ca9be]">
              Number of total sales
            </span>
          </div>
          {/* Shopping cart with checkmark SVG */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9ca9be]">
            <svg
              width="36"
              height="36"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
              />
              <path
                fillRule="evenodd"
                d="M11.354 5.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Balance */}
        <div className="p-6 relative flex flex-col justify-between">
          <div>
            <h3 className="text-[28px] font-bold text-[#203145] leading-none mb-1.5">
              ${totalBalance.toLocaleString()}
            </h3>
            <span className="text-[13px] text-[#9ca9be]">
              Balance
            </span>
          </div>
          {/* Banknote SVG */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9ca9be]">
            <svg
              width="36"
              height="36"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="opacity-70"
            >
              <path d="M14 3H1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1h-1z" />
              <path
                fillRule="evenodd"
                d="M15 5H1v8h14V5zM1 4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H1z"
              />
              <path d="M13 5a2 2 0 0 0 2 2V5h-2zM3 5a2 2 0 0 1-2 2V5h2zm10 8a2 2 0 0 1 2-2v2h-2zM3 13a2 2 0 0 0-2-2v2h2zm7-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="p-6 relative flex flex-col justify-between">
          <div>
            <h3 className="text-[28px] font-bold text-[#203145] leading-none mb-1.5">
              {productsCount}
            </h3>
            <span className="text-[13px] text-[#9ca9be]">
              Products
            </span>
          </div>
          {/* Basket SVG */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9ca9be]">
            <svg
              width="36"
              height="36"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Pending Products */}
        <div className="p-6 relative flex flex-col justify-between">
          <div>
            <h3 className="text-[28px] font-bold text-[#203145] leading-none mb-1.5">
              {pendingProductsCount}
            </h3>
            <span className="text-[13px] text-[#9ca9be]">
              Pending Products
            </span>
          </div>
          {/* Hourglass SVG */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9ca9be]">
            <svg
              width="36"
              height="36"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="opacity-70"
            >
              <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.44 0 .063.152.301.443.44A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.44 0-.063-.152-.301-.443-.44A4.5 4.5 0 0 1 3.5 3.5v-1h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256.761.57.761.842s-.228.586-.761.842A3.5 3.5 0 0 0 4.5 12v1h7v-1a3.5 3.5 0 0 0-1.989-3.158c-.533-.256-.761-.57-.761-.842s.228-.586.761-.842A3.5 3.5 0 0 0 11.5 3.5v-1h-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Row 1: Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sales Donut Chart (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#f1f3f5] flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#333B53]">Sales</h3>
            <div className="flex items-center gap-2 text-[#9ca9be]">
              <button className="hover:text-gray-700">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button className="hover:text-gray-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chart Content */}
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 text-xs font-medium text-[#414456]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-3 rounded-[2px] bg-[#1BC5BD]"></span>
                <span>Active Sales ({activeSalesCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-3 rounded-[2px] bg-[#6993FF]"></span>
                <span>Completed Sales ({completedSalesCount})</span>
              </div>
            </div>

            {/* Donut Chart SVG matching Modesy 1:1 */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#eef0f3"
                  strokeWidth="20"
                />
                {totalSalesCount > 0 ? (
                  <>
                    {/* Active Sales Slice */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="transparent"
                      stroke="#1BC5BD"
                      strokeWidth="20"
                      strokeDasharray={`${((282.743 * activeSalesCount) / totalSalesCount).toFixed(2)} 282.74`}
                      strokeDashoffset="0"
                    />
                    {/* Completed Sales Slice */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="transparent"
                      stroke="#6993FF"
                      strokeWidth="20"
                      strokeDasharray={`${((282.743 * completedSalesCount) / totalSalesCount).toFixed(2)} 282.74`}
                      strokeDashoffset={`-${((282.743 * activeSalesCount) / totalSalesCount).toFixed(2)}`}
                    />
                  </>
                ) : null}
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Monthly Sales Curve Chart (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#f1f3f5] flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#333B53]">Monthly sales</h3>
            <div className="flex items-center gap-2 text-[#9ca9be]">
              <button className="hover:text-gray-700">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button className="hover:text-gray-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chart Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-medium text-[#414456]">
              <span className="w-6 h-3 rounded-[2px] bg-[#bfe8e6] border border-[#1BC5BD]"></span>
              <span>Sales (2026)</span>
            </div>

            {/* Monthly Curve Chart SVG */}
            <div className="relative w-full h-64">
              <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bfe8e6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#bfe8e6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Grid Lines Horizontal */}
                {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((val, idx) => {
                  const y = 200 - (val / 800) * 180;
                  return (
                    <g key={idx}>
                      <line
                        x1="45"
                        y1={y}
                        x2="685"
                        y2={y}
                        stroke="#f1f3f5"
                        strokeWidth="1"
                      />
                      <text
                        x="38"
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#9ca9be"
                      >
                        ${val}
                      </text>
                    </g>
                  );
                })}

                {/* X Coordinates for 12 months (Jan - Dec) */}
                {/* Jan: 55, Feb: 110, Mar: 165, Apr: 220, May: 275, Jun: 330, Jul: 385, Aug: 440, Sep: 495, Oct: 550, Nov: 605, Dec: 660 */}

                {/* Curve Area */}
                {/* 
                  Values: 
                  Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, 
                  Aug: 720 (y = 200 - (720/800)*180 = 38), 
                  Sep: 520 (y = 200 - (520/800)*180 = 83), 
                  Oct: 0, Nov: 0, Dec: 0 
                */}
                <path
                  d="
                    M 55,200 
                    L 110,200 
                    L 165,200 
                    L 220,200 
                    L 275,200 
                    L 330,200 
                    L 385,200 
                    C 410,200 425,38 440,38 
                    C 455,38 480,83 495,83 
                    C 515,83 530,200 550,200 
                    L 605,200 
                    L 660,200 
                    L 660,200 
                    L 55,200 Z
                  "
                  fill="url(#curveGradient)"
                />

                {/* Curve Stroke */}
                <path
                  d="
                    M 55,200 
                    L 110,200 
                    L 165,200 
                    L 220,200 
                    L 275,200 
                    L 330,200 
                    L 385,200 
                    C 410,200 425,38 440,38 
                    C 455,38 480,83 495,83 
                    C 515,83 530,200 550,200 
                    L 605,200 
                    L 660,200
                  "
                  fill="none"
                  stroke="#1BC5BD"
                  strokeWidth="2"
                />

                {/* Data point dots */}
                {[
                  { x: 55, y: 200 },
                  { x: 110, y: 200 },
                  { x: 165, y: 200 },
                  { x: 220, y: 200 },
                  { x: 275, y: 200 },
                  { x: 330, y: 200 },
                  { x: 385, y: 200 },
                  { x: 440, y: 38 },
                  { x: 495, y: 83 },
                  { x: 550, y: 200 },
                  { x: 605, y: 200 },
                  { x: 660, y: 200 }
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="3"
                    fill="#fff"
                    stroke="#1BC5BD"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Month labels */}
                {[
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
                ].map((m, idx) => {
                  const x = 55 + idx * 55;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y="222"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6c757d"
                    >
                      {m}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Latest Comments & Latest Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Latest Comments */}
        <div className="bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#f1f3f5] flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#333B53]">Latest Comments</h3>
              <div className="flex items-center gap-2 text-[#9ca9be]">
                <button className="hover:text-gray-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button className="hover:text-gray-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-x-auto min-h-[140px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eef0f3] text-[#333B53] font-semibold text-[12px]">
                    <th className="py-2 px-3 font-semibold">Id</th>
                    <th className="py-2 px-3 font-semibold">Comment</th>
                    <th className="py-2 px-3 font-semibold">Product</th>
                    <th className="py-2 px-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestComments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400 text-xs">
                        {/* Empty in screenshot */}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-[#f1f3f5] flex justify-end">
            <Link
              href="/dashboard/comments"
              className="px-3 py-1 bg-[#e6e8f1] hover:bg-[#D9DBE4] text-[#434658] text-[12px] font-medium rounded transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Right: Latest Reviews */}
        <div className="bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#f1f3f5] flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#333B53]">Latest Reviews</h3>
              <div className="flex items-center gap-2 text-[#9ca9be]">
                <button className="hover:text-gray-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button className="hover:text-gray-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-x-auto min-h-[140px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eef0f3] text-[#333B53] font-semibold text-[12px]">
                    <th className="py-2 px-3 font-semibold w-[8%]">Id</th>
                    <th className="py-2 px-3 font-semibold w-[42%]">Comment</th>
                    <th className="py-2 px-3 font-semibold w-[25%]">Product</th>
                    <th className="py-2 px-3 font-semibold w-[25%]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReviews.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 text-[12px]">
                      <td className="py-3 px-3 align-top font-medium text-gray-700">
                        {r.id}
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating ? 'fill-[#ffc107] text-[#ffc107]' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[12px] text-[#414456] leading-snug">
                          {r.comment}
                        </p>
                      </td>
                      <td className="py-3 px-3 align-top">
                        <Link
                          href={`/${r.productSlug}`}
                          className="text-[#333B53] hover:underline font-normal"
                        >
                          {r.product}
                        </Link>
                      </td>
                      <td className="py-3 px-3 align-top text-gray-500 whitespace-nowrap">
                        {r.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-[#f1f3f5] flex justify-end">
            <Link
              href="/dashboard/reviews"
              className="px-3 py-1 bg-[#e6e8f1] hover:bg-[#D9DBE4] text-[#434658] text-[12px] font-medium rounded transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Latest Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow-[0_3px_10px_0_#eef3f6] border border-[#eef0f3] flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#f1f3f5] flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#333B53]">Latest Sales</h3>
              <div className="flex items-center gap-2 text-[#9ca9be]">
                <button className="hover:text-gray-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button className="hover:text-gray-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eef0f3] text-[#333B53] font-semibold text-[12px]">
                    <th className="py-2 px-3 font-semibold">Sale</th>
                    <th className="py-2 px-3 font-semibold">Status</th>
                    <th className="py-2 px-3 font-semibold">Payment</th>
                    <th className="py-2 px-3 font-semibold">Date</th>
                    <th className="py-2 px-3 font-semibold text-center">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8f9fa] text-[12px]">
                  {latestSales.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-gray-800">
                        {s.sale}
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        {s.status}
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        {s.payment}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">
                        {s.date}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Link
                          href={`/dashboard/sales`}
                          className="inline-block px-3 py-1 bg-[#17a2b8] hover:bg-[#138496] text-white text-[11px] font-medium rounded transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-[#f1f3f5] flex justify-end">
            <Link
              href="/dashboard/sales"
              className="px-3 py-1 bg-[#e6e8f1] hover:bg-[#D9DBE4] text-[#434658] text-[12px] font-medium rounded transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
