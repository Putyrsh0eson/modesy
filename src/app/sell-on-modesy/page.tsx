'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createNewProduct } from '@/lib/supabase';
import { PlusCircle, CheckCircle, ArrowRight, Store, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Lace Top', url: '/sites/modesy/prod-lace-top-1.webp' },
  { label: 'Sundress', url: '/sites/modesy/prod-sundress-1.webp' },
  { label: 'Backpack', url: '/sites/modesy/prod-backpack-1.webp' },
  { label: 'Sneakers', url: '/sites/modesy/prod-sneakers-1.webp' },
  { label: 'Handbag', url: '/sites/modesy/prod-handbag-1.webp' },
  { label: 'Decorative Pillow', url: '/sites/modesy/prod-pillow-1.webp' },
  { label: 'Digital Print', url: '/sites/modesy/prod-digital-prints-1.webp' },
  { label: 'Sun Hat', url: '/sites/modesy/prod-sunhat-1.webp' },
];

export default function SellOnModesyPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('clothing');
  const [price, setPrice] = useState('49');
  const [originalPrice, setOriginalPrice] = useState('59');
  const [stock, setStock] = useState('20');
  const [sellerName, setSellerName] = useState('My Vendor Store');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setUploadedImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;
      const numPrice = parseFloat(price) || 0;
      const numOrig = parseFloat(originalPrice) || 0;
      const discount = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

      const product = await createNewProduct({
        title: title.trim(),
        slug,
        price: numPrice,
        originalPrice: numOrig > 0 ? numOrig : undefined,
        discountPercent: discount,
        stock: parseInt(stock) || 10,
        status: 'approved',
        sku: `MOD-${Math.floor(1000 + Math.random() * 9000)}`,
        rating: 5,
        wishlistCount: 0,
        sellerName: sellerName.trim() || 'Trendshop',
        sellerSlug: sellerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        image: imageUrl,
        hoverImage: imageUrl,
        galleryImages: [imageUrl],
        description: description.trim() || `${title} is crafted with high quality standards. An ideal item in your everyday catalog.`,
        specifications: {
          Condition: 'Brand New',
          Vendor: sellerName.trim() || 'Modesy Partner',
          Origin: 'Certified Origin',
          Warranty: '1 Year Manufacturer Warranty',
        },
      });

      setCreatedSlug(product.slug);
    } catch (err) {
      console.error('Failed to create product', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdSlug) {
    return (
      <div className="bg-[#f8f9fa] min-h-[70vh] py-12">
        <div className="w-[94%] sm:w-[90%] lg:w-[90%] max-w-[650px] mx-auto bg-white rounded-md border border-[#e9ecef] p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-[#222222]">Product Published Successfully!</h1>
          <p className="text-sm text-[#666666] mt-2">
            Your item is now live on the marketplace. Customers can view, order, and review it immediately.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`/${createdSlug}`}
              className="h-11 px-6 rounded-sm bg-[#00a99d] hover:bg-[#008e84] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              View Live Product Page <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedSlug(null);
                setTitle('');
                setDescription('');
              }}
              className="h-11 px-6 rounded-sm border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#444444] font-bold text-xs transition-colors"
            >
              Add Another Product
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8">
      <div className="w-[94%] sm:w-[90%] lg:w-[90%] max-w-[960px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#222222]">Sell on Modesy</h1>
            <p className="text-xs text-[#777777] mt-1">
              Publish a new product to the marketplace catalogue with instant Supabase backend integration
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#00a99d] hover:underline"
          >
            Browse Catalogue &rarr;
          </Link>
        </div>

        {/* Product Submission Form Card */}
        <div className="bg-white rounded-md border border-[#e9ecef] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Seller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#00a99d]" /> Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Classic Vintage Leather Jacket"
                  className="w-full h-10 px-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#00a99d]" /> Seller / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Trendshop or Your Brand"
                  className="w-full h-10 px-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                />
              </div>
            </div>

            {/* Category & Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d] capitalize bg-white"
                >
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="bags-purses">Bags & Purses</option>
                  <option value="jewelry-accessories">Jewelry & Accessories</option>
                  <option value="home-living">Home & Living</option>
                  <option value="toys-entertainment">Toys & Entertainment</option>
                  <option value="graphics">Graphics & Photos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#00a99d]" /> Price ($ USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-10 px-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Original / Strikethrough Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Optional"
                  className="w-full h-10 px-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Available Stock</label>
              <input
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-10 px-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            {/* Image Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#00a99d]" /> Select Product Thumbnail
              </label>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-[#00a99d] px-3 text-xs font-semibold text-[#00a99d] hover:bg-[#00a99d]/5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Choose from storage
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
                {uploadedImageName && (
                  <span className="text-xs text-[#666666]">{uploadedImageName}</span>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setUploadedImageName('');
                    }}
                    className={`relative aspect-square rounded-sm border overflow-hidden p-1 transition-all cursor-pointer ${
                      imageUrl === preset.url
                        ? 'border-[#00a99d] ring-2 ring-[#00a99d]/30'
                        : 'border-[#dee2e6] hover:border-[#adb5bd] opacity-80'
                    }`}
                  >
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
                {uploadedImageName && (
                  <button
                    type="button"
                    onClick={() => setImageUrl(imageUrl)}
                    className="relative aspect-square rounded-sm border border-[#00a99d] ring-2 ring-[#00a99d]/30 overflow-hidden p-1"
                    aria-label={`Use uploaded image ${uploadedImageName}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={uploadedImageName}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Product Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a clear, enticing description highlighting material, size, and features..."
                className="w-full p-3 rounded-sm border border-[#dee2e6] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-sm bg-[#00a99d] hover:bg-[#008e84] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? 'Publishing Product...' : 'Publish Product to Marketplace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
