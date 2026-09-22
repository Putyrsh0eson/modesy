'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryPageContent } from '@/components/sites/modesy/products/CategoryPageContent';

function ProductsWrapper() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const seller = searchParams.get('seller') || '';

  return (
    <CategoryPageContent
      categorySlug={category || 'all'}
      subcategorySlug="all"
      categoryTitle={search ? `Search: "${search}"` : category ? category : 'All Products'}
      parentCategoryTitle=""
      searchQueryParam={search}
      sellerParam={seller}
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-[#777]">Loading catalogue...</div>}>
      <ProductsWrapper />
    </Suspense>
  );
}
