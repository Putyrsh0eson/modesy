'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { vendorService, VendorProduct } from '@/services/vendorService';
import { marketplaceStore } from '@/services/marketplaceStore';
import { PlusCircle, Search, Trash2, Eye } from 'lucide-react';

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = () => {
      vendorService.getProducts(activeTab).then(setProducts);
    };
    fetchProducts();
    return marketplaceStore.subscribe(fetchProducts);
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await vendorService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#e6e8eb] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your items, inventory status, and pricing</p>
        </div>
        <Link
          href="/dashboard/add-product"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222d32] hover:bg-gray-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-lg border border-[#e6e8eb] shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'approved', label: 'Active' },
              { id: 'pending', label: 'Pending Approval' },
              { id: 'sold', label: 'Sold / Out of Stock' },
              { id: 'draft', label: 'Drafts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#222d32] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-[#e6e8eb] text-gray-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8eb]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden shrink-0 relative bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{product.title}</p>
                          <p className="text-[11px] text-gray-400">SKU: MDS-{product.id}092</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      ${product.price.toFixed(2)}
                      {product.discountRate > 0 && (
                        <span className="ml-1 text-[10px] text-rose-500 font-normal">
                          (-{product.discountRate}%)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${product.stock > 0 ? 'text-gray-700' : 'text-rose-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          product.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : product.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-indigo-600 rounded hover:bg-gray-100"
                          title="View on Storefront"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded hover:bg-gray-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
