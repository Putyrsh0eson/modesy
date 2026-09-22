'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useModesy } from '@/context/ModesyContext';
import { getAllProducts } from '@/lib/supabase';
import { Product } from '@/types/modesy';
import { ProductCard } from '@/components/sites/modesy/products/ProductCard';

export default function WishlistPage() {
  const { wishlistIds } = useModesy();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllProducts();
      setAllProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div id="wrapper" className="bg-[#f8f9fa] min-h-screen py-6 sm:py-8">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto">
        {/* Breadcrumbs matching Modesy .nav-breadcrumb */}
        <nav className="nav-breadcrumb mb-4 text-xs text-[#777777]">
          <ol className="breadcrumb flex items-center gap-1.5">
            <li className="breadcrumb-item">
              <Link href="/" className="hover:text-[#00a99d]">Home</Link>
            </li>
            <li className="text-[#ccc]">&gt;</li>
            <li className="breadcrumb-item active text-[#222222] font-semibold">Wishlist</li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="page-title text-[24px] font-semibold text-[#222222] mb-6">
          Wishlist
        </h1>

        {/* Wishlist Content */}
        <div className="bg-white border border-[#eaeaef] rounded-[6px] p-6 sm:p-8 shadow-xs min-h-[400px]">
          {loading ? (
            <div className="py-20 text-center text-xs text-[#777]">Loading wishlist...</div>
          ) : wishlistedProducts.length === 0 ? (
            <div className="page-contact py-16 text-center">
              <p className="text-center text-[#555555] text-[15px] font-medium mb-6">No products found!</p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center h-10 px-6 rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white text-xs font-semibold transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {wishlistedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
