import React from 'react';
import { CategoryPageContent } from '@/components/sites/modesy/products/CategoryPageContent';
import type { Metadata } from 'next';

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subcategory: string }>;
}

function formatTitle(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('And', '&');
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = await params;
  const title = formatTitle(subcategory);
  return {
    title: `${title} - Modesy`,
    description: `Shop ${title} on Modesy Marketplace`,
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subcategory } = await params;

  const categoryTitle = formatTitle(subcategory);
  const parentCategoryTitle = formatTitle(slug);

  return (
    <CategoryPageContent
      categorySlug={slug}
      subcategorySlug={subcategory}
      categoryTitle={categoryTitle}
      parentCategoryTitle={parentCategoryTitle}
    />
  );
}
