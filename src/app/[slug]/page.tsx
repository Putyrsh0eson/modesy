import React from 'react';
import Link from 'next/link';
import { getAllProducts, getProductBySlug } from '@/lib/supabase';
import { ProductGallery } from '@/components/sites/modesy/product-detail/ProductGallery';
import { ProductInfo } from '@/components/sites/modesy/product-detail/ProductInfo';
import { ProductTabs } from '@/components/sites/modesy/product-detail/ProductTabs';
import { ProductCard } from '@/components/sites/modesy/products/ProductCard';
import { CategoryPageContent } from '@/components/sites/modesy/products/CategoryPageContent';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function formatTitle(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('And', '&');
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (product) {
    return {
      title: `${product.title} - Modesy - Marketplace`,
      description: product.description || `Featuring a delicate pattern that adds elegance to ${product.title}`,
    };
  }

  const categoryTitle = formatTitle(slug);
  return {
    title: `${categoryTitle} - Modesy`,
    description: `Shop ${categoryTitle} on Modesy Marketplace`,
  };
}

export default async function DynamicSlugPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // If not a product, treat as category page (e.g. /shoes, /clothing, /home-living)
  if (!product) {
    const categoryTitle = formatTitle(slug);
    return (
      <CategoryPageContent
        categorySlug={slug}
        subcategorySlug="all"
        categoryTitle={categoryTitle}
        parentCategoryTitle=""
      />
    );
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 6);

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image, ...(product.hoverImage ? [product.hoverImage] : [])];

  return (
    <div id="wrapper" className="bg-[#f8f9fa] min-h-screen py-6 sm:py-8">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto">
        {/* Breadcrumbs matching Modesy .nav-breadcrumb */}
        <nav className="nav-breadcrumb mb-6 text-xs text-[#777777] overflow-x-auto whitespace-nowrap">
          <ol className="breadcrumb flex items-center gap-2">
            <li className="breadcrumb-item">
              <Link href="/" className="hover:text-[#00a99d]">Home</Link>
            </li>
            <li className="text-[#ccc]">&gt;</li>
            <li className="breadcrumb-item">
              <Link href="/products" className="hover:text-[#00a99d]">Products</Link>
            </li>
            <li className="text-[#ccc]">&gt;</li>
            <li className="breadcrumb-item">
              <Link href={`/${product.category || 'clothing'}`} className="hover:text-[#00a99d] capitalize">
                {product.category || 'Clothing'}
              </Link>
            </li>
            <li className="text-[#ccc]">&gt;</li>
            <li className="breadcrumb-item active text-[#222222] font-semibold truncate max-w-[280px]">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Product Details Container matching Modesy .product-details-container */}
        <div className="product-details-container bg-white border border-[#eaeaef] rounded-[6px] p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-6">
              <ProductGallery images={images} title={product.title} />
            </div>

            {/* Right Column: Info & Purchase */}
            <div className="lg:col-span-6">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Tabbed Section */}
          <ProductTabs product={product} />
        </div>

        {/* Related Products matching Modesy */}
        {relatedProducts.length > 0 && (
          <div className="related-products mt-12">
            <div className="flex items-center justify-between mb-4 border-b border-[#eaeaef] pb-2.5">
              <h2 className="text-lg font-bold text-[#222222]">Related Products</h2>
              <Link href="/products" className="text-xs font-semibold text-[#00a99d] hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
