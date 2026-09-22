'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { marketplaceStore } from '@/services/marketplaceStore';
import { adminService } from '@/services/adminService';
import { AdminProductItem } from '@/types/admin';
import { Check, Trash2, ExternalLink } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const remoteProducts = await adminService.getProducts();
        if (active) {
          setProducts(remoteProducts);
          setLoadError('');
        }
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load products.');
      }
    };
    void loadProducts();
    const unsubscribe = marketplaceStore.subscribe(() => void loadProducts());
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleToggleStatus = (id: string | number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'Approved' ? 'Pending' : 'Approved' }
          : p
      )
    );
  };

  const handleDelete = (id: string | number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      marketplaceStore.deleteProduct(id);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">Products</h1>
      </div>
      {loadError && <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{loadError}</div>}

      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        {/* Search */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f5]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product title, category, SKU..."
            className="h-[34px] px-3 border border-[#dee2e6] rounded bg-[#fdfdfd] text-[13px] text-[#333333] placeholder-[#999999] focus:outline-none focus:border-[#00a99d] w-[260px]"
          />
          <div className="text-[12.5px] text-[#777777]">
            Total: <span className="font-bold text-[#333333]">{products.length}</span> products
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#dee2e6] text-[#333333] font-semibold bg-[#fafafa]">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Stock</th>
                <th className="py-2.5 px-3">Seller</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-[#eaeaef] overflow-hidden relative shrink-0 bg-[#fafafa]">
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-[#333333] hover:text-[#00a99d] line-clamp-1 max-w-[200px]">
                          {prod.title}
                        </div>
                        <Link
                          href={`/${prod.slug}`}
                          target="_blank"
                          className="text-[11px] text-[#00a99d] hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>View on site</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#666666]">{prod.sku}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{prod.category}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">${prod.price}</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-medium ${prod.stock > 10 ? 'text-[#28a745]' : 'text-[#e67e22]'}`}>
                      {prod.stock} in stock
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#555555] font-medium">{prod.seller}</td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(prod.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                        prod.status === 'Approved'
                          ? 'bg-[#e6f4ea] text-[#137333] hover:bg-[#ceead6]'
                          : 'bg-[#fef7e0] text-[#b06000] hover:bg-[#feefc3]'
                      }`}
                      title="Click to toggle status"
                    >
                      {prod.status}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(prod.id)}
                        className="p-1 rounded bg-[#f1f3f5] hover:bg-[#e9ecef] text-[#00a99d] transition-colors"
                        title={prod.status === 'Approved' ? 'Set Pending' : 'Approve'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id)}
                        className="p-1 rounded bg-[#f1f3f5] hover:bg-[#fee2e2] text-[#dc3545] transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
