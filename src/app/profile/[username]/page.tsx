'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  Package
} from 'lucide-react';
import { useModesy } from '@/context/ModesyContext';

export default function VendorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const { user } = useModesy();
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'policies'>('products');
  const isCurrentModerator = user?.role === 'moderator' && resolvedParams.username.startsWith('moderator');
  const isZazaCantik = resolvedParams.username === 'zaza-cantik';
  const displayName = isCurrentModerator ? 'Moderator' : resolvedParams.username;

  const vendor = {
    name: resolvedParams.username === 'trendshop' ? 'Trendshop Official Store' : isZazaCantik ? 'Zaza Cantik' : displayName,
    username: resolvedParams.username,
    avatar: isZazaCantik ? '/images/moderator-profile.jpg' : user?.avatar || '/sites/modesy/avatar-admin.jpg',
    banner: '/sites/modesy/banner-clothing.jpg',
    rating: 4.9,
    reviewsCount: 128,
    productsCount: 24,
    salesCount: 840,
    memberSince: 'January 2024',
    location: 'Oregon, United States',
    bio: 'Official flagship store for curated modern lifestyle apparel, women summer collections, denim jackets, and everyday essentials.'
  };

  const vendorProducts = [
    {
      id: 1,
      title: 'Floral Print Summer Dress',
      slug: 'floral-women-sundress-38',
      price: 34.00,
      image: '/sites/modesy/banner-clothing.jpg',
      rating: 5.0
    },
    {
      id: 2,
      title: 'Men Slim Fit Denim Jacket',
      slug: 'men-slim-fit-denim-jacket',
      price: 59.90,
      image: '/sites/modesy/banner-shoes.jpg',
      rating: 4.8
    },
    {
      id: 3,
      title: 'Retro Leather Casual Sneakers',
      slug: 'retro-leather-casual-sneakers',
      price: 45.00,
      image: '/sites/modesy/banner-shoes.jpg',
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Banner */}
      <div className="h-48 md:h-64 relative bg-gray-800 overflow-hidden">
        <Image
          src={vendor.banner}
          alt={vendor.name}
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10 space-y-6">
        {/* Vendor Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden relative bg-white shrink-0">
              <Image src={vendor.avatar} alt={vendor.name} fill className="object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-gray-900">{vendor.name}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Verified Seller
                </span>
              </div>
              <p className="text-xs text-gray-500 max-w-xl">{vendor.bio}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {vendor.rating} ({vendor.reviewsCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  {vendor.productsCount} Products
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {vendor.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Member since {vendor.memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 shrink-0">
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#222d32] hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Seller</span>
            </Link>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'products', label: `Products (${vendor.productsCount})` },
              { id: 'reviews', label: `Reviews (${vendor.reviewsCount})` },
              { id: 'policies', label: 'Shop Policies & Shipping' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#222d32] text-[#222d32] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vendorProducts.map(p => (
                  <Link
                    key={p.id}
                    href={`/${p.slug}`}
                    className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    <div className="h-48 relative bg-gray-100 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                          {p.title}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] pt-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{p.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900 pt-2">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-3xl">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-gray-800">Peter Jone</span>
                    <span className="text-[11px] text-gray-400">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 pt-1">
                    Excellent dress! Fabric is light and breathable for summer. Shipping took only 3 days.
                  </p>
                </div>
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="space-y-6 max-w-3xl text-xs text-gray-700">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">Shipping Policy</h3>
                  <p className="leading-relaxed">
                    All items are carefully inspected and dispatched within 24-48 hours. We use tracked expedited shipping with major international and domestic carriers. Free shipping is available on all orders over $75.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">Return & Refund Policy</h3>
                  <p className="leading-relaxed">
                    We accept returns within 14 calendar days from receipt. Items must be unworn, undamaged, and with tags attached. Once received, refunds are processed within 3 business days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
