'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/modesy';
import { useModesy } from '@/context/ModesyContext';
import { Star, ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, wishlistIds, toggleWishlist, currency } = useModesy();
  const isWishlisted = wishlistIds.includes(product.id);

  const currencyRate = currency.code === 'IDR' ? 16000 : 1;
  const price = product.price !== undefined ? Math.round(product.price * currencyRate).toLocaleString() : null;
  const originalPrice = product.originalPrice !== undefined ? Math.round(product.originalPrice * currencyRate).toLocaleString() : null;

  return (
    <div className="product-card group bg-white border border-[#eaeaef] rounded-[6px] flex flex-col h-full overflow-hidden relative transition-all duration-300 hover:shadow-[0_0_18px_3px_rgba(0,0,0,0.05)] w-full">
      {/* Product Image Container */}
      <div className="product-image-container relative aspect-square w-full overflow-hidden bg-[#fafafa]">
        {/* Discount Badge matching Modesy .product-card-badge-red */}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="product-card-badge product-card-badge-red absolute top-0 left-0 z-10 flex items-center h-[24px] px-2.5 text-[11px] font-semibold text-white bg-[#fe2e3e] rounded-tl-[6px] rounded-br-[11px]">
            -{product.discountPercent}%
          </span>
        )}

        {/* Product Images (Default + Hover Image) */}
        <Link href={`/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`product-image default-image object-cover absolute inset-0 transition-opacity duration-300 ${
              product.hoverImage ? 'group-hover:opacity-0' : ''
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={product.title}
              fill
              className="product-image hover-image object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            />
          )}
        </Link>

        {/* Hover Action Overlay Buttons */}
        <div className="product-actions-overlay absolute top-3 right-3 z-10 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          {/* Add to Cart */}
          {!product.requestQuote && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              title="Add to Cart"
              aria-label="Add to Cart"
              className="action-btn cart-btn w-[38px] h-[38px] rounded-full bg-white border border-[#eaeaef] shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#222222] hover:bg-[#00a99d] hover:text-white hover:border-[#00a99d] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
            className="action-btn wishlist-btn w-[38px] h-[38px] rounded-full bg-white border border-[#eaeaef] shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#222222] hover:bg-[#00a99d] hover:text-white hover:border-[#00a99d] transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#fe2e3e] text-[#fe2e3e]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-3 flex flex-col flex-grow justify-between">
        <div>
          {/* Title */}
          <h3 className="product-title text-[14px] font-semibold text-[#222222] line-clamp-2 leading-[1.25rem] mb-1 hover:text-[#00a99d] transition-colors">
            <Link href={`/${product.slug}`}>{product.title}</Link>
          </h3>

          {/* Seller */}
          <div className="product-seller text-[12.8px] text-[#6c757d] mb-1.5 truncate">
            <Link href={`/products?seller=${encodeURIComponent(product.sellerSlug)}`} className="hover:text-[#00a99d] transition-colors">
              {product.sellerName}
            </Link>
          </div>
        </div>

        <div>
          {/* Rating & Wishlist count */}
          <div className="product-rating flex items-center justify-between mb-2">
            <div className="rating flex items-center gap-0.5 text-[#ffc107]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(product.rating || 0)
                      ? 'fill-current text-[#ffc107]'
                      : 'text-[#e0e0e0]'
                  }`}
                />
              ))}
            </div>
            <span className="item-wishlist text-[12px] text-[#9a9a9a] flex items-center gap-1 font-normal">
              <Heart className="w-3 h-3 text-[#9a9a9a]" />
              {product.wishlistCount || 0}
            </span>
          </div>

          {/* Footer Price */}
          <div className="product-footer pt-1 border-t border-[#f8f9fa]">
            <div className="product-price flex items-center gap-2">
              {product.isFree ? (
                <span className="price text-[15px] font-bold text-[#00a99d]">Free</span>
              ) : product.requestQuote ? (
                <span className="price text-[14px] font-semibold text-[#222222]">Request a Quote</span>
              ) : product.discountPercent && product.discountPercent > 0 ? (
                <>
                  <span className="price price-green text-[15px] font-bold text-[#00a99d]">
                    {currency.symbol}{price}
                  </span>
                  <del className="discount-original-price text-[14px] font-bold text-[#6c757d]">
                    {currency.symbol}{originalPrice}
                  </del>
                </>
              ) : (
                <span className="price text-[15px] font-bold text-[#222222]">
                  {currency.symbol}{price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
