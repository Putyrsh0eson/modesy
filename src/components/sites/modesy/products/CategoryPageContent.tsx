'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/supabase';
import { Product } from '@/types/modesy';
import { ProductCard } from '@/components/sites/modesy/products/ProductCard';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const BRANDS = [
  'Adidas',
  'Armani',
  'Diesel',
  'Dockers',
  'Lacoste',
  'Nike',
  'Puma',
  'U.S. Polo Assn',
];

interface CategoryPageContentProps {
  categorySlug?: string;
  subcategorySlug?: string;
  categoryTitle?: string;
  parentCategoryTitle?: string;
  searchQueryParam?: string;
  sellerParam?: string;
}

export function CategoryPageContent({
  categorySlug = 'shoes',
  subcategorySlug = 'sneakers-athletic-shoes',
  categoryTitle = 'Sneakers & Athletic Shoes',
  parentCategoryTitle = "Women's Shoes",
  searchQueryParam = '',
  sellerParam = '',
}: CategoryPageContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'most_recent' | 'lowest_price' | 'highest_price' | 'highest_rating'>('most_recent');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category / Subcategory match
        if (subcategorySlug && subcategorySlug !== 'all') {
          const matchSlug = p.slug.toLowerCase().includes('sneaker') || p.slug.toLowerCase().includes('shoe');
          const matchCat = p.category?.toLowerCase().includes('shoe');
          if (!matchSlug && !matchCat && subcategorySlug.includes('shoe')) {
            // Keep clothing items if looking at clothing, or shoes if looking at shoes
            return false;
          }
        }

        // Search query
        if (searchQueryParam.trim()) {
          const q = searchQueryParam.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Seller
        if (sellerParam) {
          if (p.sellerSlug !== sellerParam && p.sellerName.toLowerCase() !== sellerParam.toLowerCase()) {
            return false;
          }
        }

        // Price range
        const numMin = parseFloat(minPrice);
        const numMax = parseFloat(maxPrice);
        if (!isNaN(numMin) && (p.price || 0) < numMin) return false;
        if (!isNaN(numMax) && (p.price || 0) > numMax) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'lowest_price') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'highest_price') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'highest_rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // Most recent
      });
  }, [products, subcategorySlug, searchQueryParam, sellerParam, minPrice, maxPrice, sortBy]);

  const sortLabel = {
    most_recent: 'Most Recent',
    lowest_price: 'Lowest Price',
    highest_price: 'Highest Price',
    highest_rating: 'Highest Rating',
  }[sortBy];

  return (
    <div id="wrapper" className="bg-[#f8f9fa] min-h-screen py-6 sm:py-8">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto">
        {/* Breadcrumb matching Modesy .nav-breadcrumb */}
        <div className="row mb-4">
          <div className="col-12">
            <nav className="nav-breadcrumb text-xs text-[#777777] overflow-x-auto whitespace-nowrap">
              <ol className="breadcrumb breadcrumb-products flex items-center gap-1.5">
                <li className="breadcrumb-item">
                  <Link href="/" className="hover:text-[#00a99d]">Home</Link>
                </li>
                <li className="text-[#ccc]">&gt;</li>
                <li className="breadcrumb-item">
                  <Link href="/products" className="hover:text-[#00a99d]">Products</Link>
                </li>
                <li className="text-[#ccc]">&gt;</li>
                <li className="breadcrumb-item">
                  <Link href={`/${categorySlug}`} className="hover:text-[#00a99d] capitalize">
                    {categorySlug.replace(/-/g, ' ')}
                  </Link>
                </li>
                {parentCategoryTitle && (
                  <>
                    <li className="text-[#ccc]">&gt;</li>
                    <li className="breadcrumb-item">
                      <span className="hover:text-[#00a99d]">{parentCategoryTitle}</span>
                    </li>
                  </>
                )}
                <li className="text-[#ccc]">&gt;</li>
                <li className="breadcrumb-item active text-[#222222] font-semibold">
                  {categoryTitle}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters (col-md-3) & Product Grid (col-md-9) */}
        <div className="container-products-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: .product-filters */}
            <div className="lg:col-span-3 col-sidebar-products bg-white border border-[#eaeaef] rounded-[6px] p-5 shadow-xs space-y-5">
              {/* Category Filter */}
              <div className="filter-item filter-item-categories border-b border-[#ebecf2] pb-5">
                <h4 className="title text-sm font-semibold text-[#222222] mb-3">Category</h4>
                <Link
                  href="/products"
                  className="filter-list-categories-parent flex items-center gap-1.5 text-xs text-[#00a99d] font-semibold hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{categoryTitle}</span>
                </Link>
              </div>

              {/* Brand Filter */}
              <div className="filter-item border-b border-[#ebecf2] pb-5">
                <div className="collapse-title flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-[#222222]">Brand</span>
                </div>
                <div className="filter-list max-h-[220px] overflow-y-auto space-y-2 text-xs text-[#444444]">
                  {BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded-[2px] accent-[#00a99d]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-item">
                <div className="collapse-title mb-3">
                  <span className="text-sm font-semibold text-[#222222]">Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-8 px-2 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                  />
                  <span className="text-xs text-[#888]">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-8 px-2 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>
              </div>
            </div>

            {/* Right Content: Header Sort & Product Cards Grid (col-md-9) */}
            <div className="lg:col-span-9 col-content-products space-y-5">
              {/* Product List Header */}
              <div className="product-list-header flex items-center justify-between pb-3 border-b border-[#eaeaef]">
                <div className="text-xs text-[#777777]">
                  Showing <strong className="text-[#222222]">{filteredProducts.length}</strong> products
                </div>

                {/* Sort By Dropdown matching Modesy .product-sort-by */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="h-10 px-4 rounded-[3px] border border-[#e5e5e5] bg-white text-xs font-semibold text-[#444444] flex items-center gap-2 hover:border-[#bbb] transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#666]">
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="m21 8-4-4-4 4" />
                      <path d="M17 4v16" />
                    </svg>
                    <span>{sortLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#888]" />
                  </button>

                  {isSortOpen && (
                    <div className="absolute right-0 top-11 w-48 bg-white border border-[#e5e5e5] rounded-[3px] shadow-lg z-20 py-1 text-xs">
                      {[
                        { key: 'most_recent', label: 'Most Recent' },
                        { key: 'lowest_price', label: 'Lowest Price' },
                        { key: 'highest_price', label: 'Highest Price' },
                        { key: 'highest_rating', label: 'Highest Rating' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.key as 'most_recent' | 'lowest_price' | 'highest_price' | 'highest_rating');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-[#f8f9fa] transition-colors ${
                            sortBy === opt.key ? 'text-[#00a99d] font-bold bg-[#00a99d]/5' : 'text-[#333]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid matching Modesy col-lg-3 4-columns */}
              {loading ? (
                <div className="py-20 text-center text-xs text-[#777]">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#eaeaef] rounded-[6px] p-12 text-center shadow-xs">
                  <p className="text-sm text-[#777] mb-4">No products found matching the criteria.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setSelectedBrands([]);
                    }}
                    className="text-xs font-semibold text-[#00a99d] hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
