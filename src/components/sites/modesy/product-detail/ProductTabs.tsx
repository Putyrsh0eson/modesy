'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/modesy';
import { Star, Flag, MapPin, MessageSquare } from 'lucide-react';
import { marketplaceStore } from '@/services/marketplaceStore';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    'description' | 'additional' | 'shipping' | 'reviews' | 'comments'
  >('description');

  const [storeReviews, setStoreReviews] = useState(() =>
    marketplaceStore.getProductReviews(product.slug)
  );
  const [storeComments, setStoreComments] = useState(() =>
    marketplaceStore.getProductComments(product.slug)
  );

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setStoreReviews(marketplaceStore.getProductReviews(product.slug));
      setStoreComments(marketplaceStore.getProductComments(product.slug));
    });
    return unsub;
  }, [product.slug]);

  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Comment state
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !reviewText) return;

    marketplaceStore.addReview({
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      authorName,
      authorEmail: 'member@modesy.com',
      rating: userRating,
      comment: reviewText,
      sellerSlug: product.sellerSlug || 'trendshop'
    });

    setAuthorName('');
    setReviewText('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor || !commentText) return;

    marketplaceStore.addComment({
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      authorName: commentAuthor,
      authorEmail: 'member@modesy.com',
      comment: commentText,
      sellerSlug: product.sellerSlug || 'trendshop'
    });

    setCommentAuthor('');
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  return (
    <div id="product_description_content" className="product-description mt-8 bg-white border border-[#eaeaef] rounded-[6px] overflow-hidden">
      {/* Tab Navigation matching Modesy .nav-tabs-horizontal */}
      <div className="border-b border-[#eaeaef] bg-[#fdfdfd] overflow-x-auto">
        <ul className="flex flex-nowrap min-w-max text-sm font-semibold text-[#555555]">
          <li>
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'description'
                  ? 'border-[#00a99d] text-[#00a99d] bg-white'
                  : 'border-transparent hover:text-black'
              }`}
            >
              Description
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab('additional')}
              className={`px-6 py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'additional'
                  ? 'border-[#00a99d] text-[#00a99d] bg-white'
                  : 'border-transparent hover:text-black'
              }`}
            >
              Additional Information
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'shipping'
                  ? 'border-[#00a99d] text-[#00a99d] bg-white'
                  : 'border-transparent hover:text-black'
              }`}
            >
              Shipping & Location
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-[#00a99d] text-[#00a99d] bg-white'
                  : 'border-transparent hover:text-black'
              }`}
            >
              Reviews ({storeReviews.length})
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'comments'
                  ? 'border-[#00a99d] text-[#00a99d] bg-white'
                  : 'border-transparent hover:text-black'
              }`}
            >
              Comments ({storeComments.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Panes */}
      <div className="p-6 sm:p-8">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-4">
            <div className="entry-content text-sm text-[#444444] leading-relaxed">
              <p>
                {product.description ||
                  `The ${product.title} is a beautiful blend of style and comfort, perfect for warm, sunny days. Featuring a delicate floral pattern that adds a touch of elegance, this sundress is designed to keep you feeling light and breezy. Its flowy silhouette and soft fabric provide a flattering, relaxed fit, while adjustable straps ensure comfort and flexibility. Ideal for beach days, brunch outings, or summer gatherings.`}
              </p>
            </div>
            <div className="pt-4 border-t border-[#f1f3f5] flex justify-end">
              <button
                type="button"
                className="text-xs text-[#888888] hover:text-[#fe2e3e] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Flag className="w-3 h-3" /> Report this product
              </button>
            </div>
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === 'additional' && (
          <div className="max-w-xl">
            <table className="w-full text-xs text-left border border-[#dee2e6] rounded-[3px] overflow-hidden">
              <tbody>
                <tr className="border-b border-[#dee2e6] bg-[#f9f9f9]">
                  <td className="p-3 font-semibold text-[#444444] w-1/3 border-r border-[#dee2e6]">Fabric</td>
                  <td className="p-3 text-[#222222]">Bamboo, Cotton, Silk</td>
                </tr>
                <tr className="border-b border-[#dee2e6] bg-white">
                  <td className="p-3 font-semibold text-[#444444] border-r border-[#dee2e6]">Style</td>
                  <td className="p-3 text-[#222222]">Bohemian, Casual Summer</td>
                </tr>
                <tr className="border-b border-[#dee2e6] bg-[#f9f9f9]">
                  <td className="p-3 font-semibold text-[#444444] border-r border-[#dee2e6]">Care</td>
                  <td className="p-3 text-[#222222]">Hand Wash or Dry Clean Only</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-semibold text-[#444444] border-r border-[#dee2e6]">Origin</td>
                  <td className="p-3 text-[#222222]">Artisan Made</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Shipping & Location Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 text-xs sm:text-sm text-[#444444]">
            <div>
              <h4 className="font-bold text-[#222222] mb-1.5 text-sm">Shipping Information</h4>
              <p>Ready to ship in 2-3 Business Days. Standard delivery takes approximately 3-5 days.</p>
            </div>
            <div className="pt-3 border-t border-[#f1f3f5]">
              <h4 className="font-bold text-[#222222] mb-1.5 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00a99d]" /> Seller Location
              </h4>
              <p>Jakarta, Indonesia</p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#222222]">Customer Reviews ({storeReviews.length})</h3>
              {storeReviews.length === 0 ? (
                <div className="text-xs text-[#666666] py-4 text-center">
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                storeReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-[4px] border border-[#f1f3f5] bg-[#fafafa] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#222222]">{rev.authorName}</span>
                      <span className="text-xs text-[#888888]">{rev.date}</span>
                    </div>
                    <div className="flex text-[#ffc107]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-current text-[#ffc107]' : 'text-[#e0e0e0]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            <div className="p-5 border border-[#eaeaef] rounded-[4px] bg-white">
              <h4 className="font-bold text-sm text-[#222222] mb-3">Write a Review</h4>
              {reviewSuccess && (
                <div className="p-2.5 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[3px]">
                  Thank you! Your review has been added and updated in vendor & admin dashboards.
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUserRating(s)}
                        className="p-0.5 text-[#ffc107] cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            s <= userRating ? 'fill-current text-[#ffc107]' : 'text-[#e0e0e0]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-9 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                    className="w-full p-2.5 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>

                <button
                  type="submit"
                  className="h-9 px-5 bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-xs rounded-[3px] transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#222222]">Product Comments ({storeComments.length})</h3>
              {storeComments.length === 0 ? (
                <div className="text-xs text-[#666666] py-4 text-center">
                  No comments yet. Be the first to leave a comment!
                </div>
              ) : (
                storeComments.map((c) => (
                  <div key={c.id} className="p-4 rounded-[4px] border border-[#f1f3f5] bg-[#fafafa] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#222222]">{c.authorName}</span>
                      <span className="text-xs text-[#888888]">{c.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Comment Form */}
            <div className="p-5 border border-[#eaeaef] rounded-[4px] bg-white">
              <h4 className="font-bold text-sm text-[#222222] mb-3">Leave a Comment</h4>
              {commentSuccess && (
                <div className="p-2.5 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[3px]">
                  Thank you! Your comment has been posted.
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-9 px-3 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">Comment *</label>
                  <textarea
                    required
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ask a question or leave feedback..."
                    className="w-full p-2.5 border border-[#dee2e6] rounded-[3px] text-xs text-[#222222] focus:outline-none focus:border-[#00a99d]"
                  />
                </div>

                <button
                  type="submit"
                  className="h-9 px-5 bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-xs rounded-[3px] transition-colors cursor-pointer"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
