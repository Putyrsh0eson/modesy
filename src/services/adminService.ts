import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { marketplaceStore } from './marketplaceStore';
import {
  ADMIN_TRANSACTIONS,
  ADMIN_ORDERS,
  ADMIN_PRODUCTS,
  ADMIN_CATEGORIES,
  ADMIN_USERS,
  ADMIN_EARNINGS,
  ADMIN_STATS,
} from '@/data/admin-mock';
import {
  AdminTransaction,
  AdminOrder,
  AdminProductItem,
  AdminCategoryItem,
  AdminUserItem,
  AdminEarning,
  AdminStat,
} from '@/types/admin';

export const adminService = {
  // 1. Transactions
  async getTransactions(searchQuery?: string): Promise<AdminTransaction[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('transactions').select('*').order('id', { ascending: false });
        if (searchQuery) {
          query = query.or(`order_number.ilike.%${searchQuery}%,payment_id.ilike.%${searchQuery}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            order: d.order_number,
            paymentMethod: d.payment_method,
            paymentId: d.payment_id,
            user: d.user_id === 1 ? 'Admin' : d.user_id === 2 ? 'Trendshop' : 'Member',
            currency: d.currency,
            paymentAmount: Number(d.payment_amount),
            paymentStatus: d.payment_status,
            ipAddress: d.ip_address || '127.0.0.1',
            date: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getTransactions fallback:', err);
      }
    }

    // Local / Offline fallback
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ADMIN_TRANSACTIONS.filter(
        (t) =>
          t.order.toLowerCase().includes(q) ||
          t.paymentId.toLowerCase().includes(q) ||
          t.user.toLowerCase().includes(q)
      );
    }
    return ADMIN_TRANSACTIONS;
  },

  // 2. Orders
  async getOrders(): Promise<AdminOrder[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((o) => ({
            id: o.id,
            orderNumber: o.order_number,
            buyerName: o.buyer_id === 1 ? 'Admin' : 'Customer',
            buyerEmail: 'user@codingest.net',
            totalAmount: Number(o.price_total),
            currency: o.price_currency || 'USD',
            paymentStatus: o.payment_status === 'payment_received' ? 'Paid' : 'Unpaid',
            orderStatus: o.order_status === 'completed' ? 'Completed' : 'Processing',
            itemCount: 1,
            date: o.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getOrders fallback:', err);
      }
    }
    
    // Live Marketplace Store Orders
    const storeOrders = marketplaceStore.getOrders();
    return storeOrders.map(o => ({
      id: parseInt(o.id) || 1,
      orderNumber: o.orderNumber,
      buyerName: o.customer.fullName,
      buyerEmail: o.customer.email,
      totalAmount: o.total,
      currency: o.currency,
      paymentStatus: 'Paid',
      orderStatus: o.status === 'completed' ? 'Completed' : o.status === 'shipped' ? 'Shipped' : 'Processing',
      itemCount: o.items.length,
      date: o.createdAt,
    }));
  },

  // 3. Products
  async getProducts(): Promise<AdminProductItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: 'Clothing',
            price: Number(p.price),
            stock: p.stock || 10,
            sku: p.sku || `SKU-${p.id}`,
            seller: 'Admin',
            status: p.status === 'approved' ? 'Approved' : 'Pending',
            featured: Boolean(p.is_promoted),
            image: '/sites/modesy/prod-sundress-1.webp',
            createdAt: p.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getProducts fallback:', err);
      }
    }

    // Live Marketplace Store Products
    const storeProds = marketplaceStore.getProducts();
    return storeProds.map(p => ({
      id: typeof p.id === 'number' ? p.id : parseInt(String(p.id)) || 1,
      title: p.title,
      slug: p.slug,
      category: p.category || 'Clothing',
      price: p.price || 0,
      stock: p.stock || 10,
      sku: p.sku || `SKU-${p.id}`,
      seller: p.sellerName || 'Admin',
      status: 'Approved',
      featured: true,
      image: p.image || '/sites/modesy/prod-sundress-1.webp',
      createdAt: p.createdAt || '2026-09-08',
    }));
  },

  // 4. Categories
  async getCategories(): Promise<AdminCategoryItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            name: c.slug.replace('-', ' ').toUpperCase(),
            slug: c.slug,
            order: c.sort_order,
            productCount: 12,
            visibility: c.visibility,
          }));
        }
      } catch (err) {
        console.warn('Supabase getCategories fallback:', err);
      }
    }
    return ADMIN_CATEGORIES;
  },

  // 5. Users
  async getUsers(): Promise<AdminUserItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').order('id', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role_id === 1 ? 'Super Admin' : u.is_vendor ? 'Vendor' : 'Member',
            status: u.status === 'active' ? 'Active' : 'Banned',
            balance: Number(u.balance || 0),
            joinDate: u.created_at,
            avatar: u.avatar || '/sites/modesy/avatar-admin.jpg',
          }));
        }
      } catch (err) {
        console.warn('Supabase getUsers fallback:', err);
      }
    }
    return ADMIN_USERS;
  },

  // 6. Stats
  async getStats(): Promise<AdminStat> {
    return ADMIN_STATS;
  },

  // 7. Earnings
  async getEarnings(): Promise<AdminEarning[]> {
    return ADMIN_EARNINGS;
  },
};
