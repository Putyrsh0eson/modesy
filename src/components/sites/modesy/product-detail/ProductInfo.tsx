'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/modesy';
import { useModesy } from '@/context/ModesyContext';
import {
  Star,
  Heart,
  MessageSquare,
  Eye,
  Mail,
  Truck,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, WhatsAppIcon, PinterestIcon, LinkedInIcon, TelegramIcon } from '@/components/icons';

interface ProductInfoProps {
  product: Product;
}

const COLOR_VARIANTS = [
  { name: 'Dark', image: '/sites/modesy/prod-sundress-1.webp' },
  { name: 'Blue', image: '/sites/modesy/prod-blue-handbag-1.webp' },
  { name: 'Purple', image: '/sites/modesy/prod-lace-blouse-1.webp' },
  { name: 'Red', image: '/sites/modesy/prod-digital-prints-1.webp' },
];

const SIZE_VARIANTS = ['S', 'M', 'L', 'XL'];

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, wishlistIds, toggleWishlist, currency, setLocationModalOpen } = useModesy();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Dark');
  const [selectedSize, setSelectedSize] = useState('S');

  const isWishlisted = wishlistIds.includes(product.id);
  const currencyRate = currency.code === 'IDR' ? 16000 : 1;

  const finalPrice = product.price !== undefined
    ? Math.round(product.price * currencyRate).toLocaleString()
    : '80';
  const originalPrice = product.originalPrice !== undefined
    ? Math.round(product.originalPrice * currencyRate).toLocaleString()
    : '89';

  const sku = product.sku
    ? `${product.sku}-${selectedColor}-${selectedSize}`
    : `F1W2S3D4R5S6-${selectedColor}-${selectedSize}`;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        title: `${product.title} (${selectedColor} / ${selectedSize})`,
        sku,
      });
    }
  };

  return (
    <div className="product-content-details flex flex-col w-full text-[#222222]">
      {/* Product Title */}
      <h1 className="product-title text-[24px] font-semibold leading-[32px] text-[#222222] mb-2.5">
        {product.title}
      </h1>

      {/* Meta info row */}
      <div className="meta mb-3 pb-2 border-b border-[#f1f3f5]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[14px] text-[#777777]">
          {/* Left: Seller & Rating */}
          <div className="flex items-center flex-wrap gap-2">
            <span>
              Seller:&nbsp;
              <Link
                href={`/products?seller=${encodeURIComponent(product.sellerSlug)}`}
                className="font-semibold text-[#555555] hover:text-black transition-colors"
              >
                {product.sellerName || 'Admin'}
              </Link>
            </span>
            <span className="text-[#ddd]">|</span>
            <div className="product-details-review flex items-center gap-1.5">
              <div className="rating flex items-center gap-0.5 text-[#ffc107]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(product.rating || 4)
                        ? 'fill-current text-[#ffc107]'
                        : 'text-[#e0e0e0]'
                    }`}
                  />
                ))}
              </div>
              <a href="#reviews" className="review-text text-[#555555] text-xs hover:underline ml-1">
                Reviews ({product.rating ? '1' : '0'})
              </a>
            </div>
          </div>

          {/* Right: Analytics */}
          <div className="product-analytics flex items-center gap-3.5 text-[13px] text-[#9a9a9a]">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> 0
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {product.wishlistCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> 179
            </span>
          </div>
        </div>
      </div>

      {/* Price & Contact buttons row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Price Container */}
        <div className="product-price-container flex items-baseline gap-2.5 min-h-[36px]">
          {product.isFree ? (
            <span className="final-price text-[32px] font-bold text-[#00a99d]">Free</span>
          ) : product.requestQuote ? (
            <span className="final-price text-[22px] font-bold text-[#222222]">Request a Quote</span>
          ) : (
            <>
              <span className="final-price text-[32px] font-bold text-[#222222]">
                {currency.symbol}{finalPrice}
              </span>
              {originalPrice && (
                <span className="original-price text-[22px] font-bold text-[#8f8f8f] line-through">
                  {currency.symbol}{originalPrice}
                </span>
              )}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="discount-rate bg-[#fe2e3e] text-white text-[13px] font-normal px-2.5 py-1 rounded-[2px]">
                  -{product.discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Contact buttons */}
        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/123?text=${encodeURIComponent(product.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp h-9 px-3 rounded-[3px] border border-[#25d366] text-[#25d366] hover:bg-[#25d366] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Ask Question */}
          <button
            type="button"
            onClick={() => router.push(`/messages?seller=vendor&productId=${product.id}`)}
            className="btn btn-contact-seller h-9 px-3 rounded-[3px] border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#555555] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#777777]" />
            <span>Ask Question</span>
          </button>
        </div>
      </div>

      {/* Details (Status & SKU) */}
      <div className="details text-xs space-y-2 mb-4 pt-2 border-t border-[#f1f3f5]">
        <div className="item-details flex items-center">
          <div className="left w-[110px] text-[#666666] font-medium">Status</div>
          <div className="right text-[#31ae6a] font-semibold">In Stock</div>
        </div>
        <div className="item-details flex items-center">
          <div className="left w-[110px] text-[#666666] font-medium">SKU</div>
          <div className="right text-[#333333] font-mono">{sku}</div>
        </div>
      </div>

      {/* Product Variant Options (Color & Size) */}
      <div className="product-options-container space-y-3.5 mb-5 pb-4 border-b border-[#f1f3f5]">
        {/* Color Swatches */}
        <div>
          <label className="block text-xs font-semibold text-[#444444] mb-2">
            Color: <span className="font-normal text-[#666666]">{selectedColor}</span>
          </label>
          <div className="flex items-center gap-2">
            {COLOR_VARIANTS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                className={`relative w-10 h-10 rounded-[3px] overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedColor === c.name
                    ? 'border-[#00a99d] ring-2 ring-[#00a99d]/20'
                    : 'border-[#dee2e6] opacity-75 hover:opacity-100'
                }`}
                title={c.name}
              >
                <Image src={c.image} alt={c.name} fill className="object-cover" sizes="40px" />
              </button>
            ))}
          </div>
        </div>

        {/* Size Radio Pills */}
        <div>
          <label className="block text-xs font-semibold text-[#444444] mb-2">
            Size: <span className="font-normal text-[#666666]">{selectedSize}</span>
          </label>
          <div className="flex items-center gap-2">
            {SIZE_VARIANTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`min-w-[42px] h-9 px-3 rounded-[3px] text-xs font-semibold border transition-all cursor-pointer ${
                  selectedSize === s
                    ? 'border-[#00a99d] bg-[#00a99d]/10 text-[#00a99d]'
                    : 'border-[#dee2e6] bg-white text-[#444444] hover:border-[#bbb]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add to Cart Container matching Modesy layout */}
      <div className="product-add-to-cart-container flex flex-wrap items-center gap-3 mb-6">
        {/* Number Spinner */}
        <div className="number-spinner inline-flex items-center h-[46px] w-[126px] border border-[#e0e0e0] rounded-[3px] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-full flex items-center justify-center text-[#555555] hover:bg-[#f5f5f5] text-lg font-bold border-r border-[#e0e0e0] cursor-pointer"
          >
            -
          </button>
          <input
            type="text"
            readOnly
            value={quantity}
            className="flex-1 h-full text-center text-sm font-semibold text-[#222222] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-full flex items-center justify-center text-[#555555] hover:bg-[#f5f5f5] text-lg font-bold border-l border-[#e0e0e0] cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn btn-md btn-custom btn-product-cart h-[46px] flex-1 min-w-[180px] rounded-[3px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>

        {/* Add to Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="button-link btn-wishlist h-[46px] px-3.5 rounded-[3px] border border-[#dee2e6] hover:bg-[#f8f9fa] text-xs font-semibold text-[#555555] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#fe2e3e] text-[#fe2e3e]' : 'text-[#777777]'}`}
          />
          <span>{isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</span>
        </button>
      </div>

      {/* Delivery Estimate & Location */}
      <div className="product-delivery-est text-xs text-[#545454] space-y-2.5 pt-2 border-t border-[#f1f3f5]">
        <div className="item flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#7c818b] flex-shrink-0" />
          <span>Ready to ship in 2-3 Business Days</span>
        </div>

        <div className="item flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7c818b] flex-shrink-0" />
          <span>Estimated Delivery:</span>
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="underline font-medium text-[#545454] hover:text-[#00a99d] cursor-pointer"
          >
            Select Location
          </button>
        </div>

        {/* Share buttons matching Modesy SVG icons */}
        <div className="item flex items-center gap-3 pt-2">
          <strong className="font-semibold text-[#333333]">Share:</strong>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
              className="w-7 h-7 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Share on Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://twitter.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.title)}`)}
              className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Share on X"
            >
              <TwitterIcon className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(product.title + ' ' + window.location.href)}`)}
              className="w-7 h-7 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => window.open(`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`)}
              className="w-7 h-7 rounded-full bg-[#cb2027] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Share on Pinterest"
            >
              <PinterestIcon className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`)}
              className="w-7 h-7 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Share on LinkedIn"
            >
              <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`)}
              className="w-7 h-7 rounded-full bg-[#0088cc] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Share on Telegram"
            >
              <TelegramIcon className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
