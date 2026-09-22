'use client';

import React, { useState } from 'react';
import { ADMIN_CATEGORIES } from '@/data/admin-mock';
import { AdminCategoryItem } from '@/types/admin';
import { Plus, Trash2, X, Eye, EyeOff } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(ADMIN_CATEGORIES);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  const handleToggleVisibility = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visibility: !c.visibility } : c))
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: AdminCategoryItem = {
      id: Date.now(),
      name: newCatName.trim(),
      slug,
      order: categories.length + 1,
      productCount: 0,
      visibility: true,
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#333333]">Categories</h1>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="px-3.5 py-1.5 rounded bg-[#00a99d] hover:bg-[#008e84] text-white text-[13px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded border border-[#eaeaef] shadow-2xs p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#dee2e6] text-[#333333] font-semibold bg-[#fafafa]">
                <th className="py-2.5 px-3">Id</th>
                <th className="py-2.5 px-3">Category Name</th>
                <th className="py-2.5 px-3">Slug</th>
                <th className="py-2.5 px-3">Products</th>
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Visibility</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#f8f9fa]">
                  <td className="py-2.5 px-3 text-[#777777]">{cat.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#333333]">{cat.name}</td>
                  <td className="py-2.5 px-3 font-mono text-[11.5px] text-[#666666]">{cat.slug}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{cat.productCount}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{cat.order}</td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(cat.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        cat.visibility
                          ? 'bg-[#e6f4ea] text-[#137333]'
                          : 'bg-[#fce8e6] text-[#c5221f]'
                      }`}
                    >
                      {cat.visibility ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{cat.visibility ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 rounded bg-[#f1f3f5] hover:bg-[#fee2e2] text-[#dc3545] transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-md max-w-md w-full shadow-2xl overflow-hidden border border-[#dee2e6]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#dee2e6]">
              <h3 className="font-bold text-[15px] text-[#333333]">Add New Category</h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-[#888888] hover:text-[#222222]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-4 space-y-3 text-[13px]">
              <div>
                <label className="block font-medium text-[#333333] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Vintage Watches"
                  className="w-full h-[36px] px-3 border border-[#dee2e6] rounded text-[#333333] focus:outline-none focus:border-[#00a99d]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#333333] mb-1">Slug (optional)</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. vintage-watches"
                  className="w-full h-[36px] px-3 border border-[#dee2e6] rounded text-[#333333] focus:outline-none focus:border-[#00a99d]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#f1f3f5] text-[#555555] hover:bg-[#e9ecef]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#00a99d] text-white font-semibold hover:bg-[#008e84]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
