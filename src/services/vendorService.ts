import { createNewProduct } from '@/lib/supabase';

export interface VendorProduct {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: number;
  discountRate: number;
  stock: number;
  status: 'approved' | 'pending' | 'draft' | 'hidden' | 'sold';
  image: string;
  createdAt: string;
}

export interface VendorSale {
  id: number;
  orderNumber: string;
  buyerName: string;
  productTitle: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderStatus: 'processing' | 'shipped' | 'completed' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface VendorEarning {
  id: number;
  orderNumber: string;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netEarning: number;
  createdAt: string;
}

export interface VendorPayout {
  id: number;
  payoutMethod: 'PayPal' | 'Bank Transfer' | 'Swift';
  amount: number;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface VendorCoupon {
  id: number;
  code: string;
  discountRate: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  usageLimit: number;
  usedCount: number;
  status: boolean;
  expiryDate: string;
}

// Initial default vendor state (trendshop)
const mockVendorProducts: VendorProduct[] = [
  {
    id: 1,
    title: 'Floral Print Summer Dress',
    slug: 'floral-print-summer-dress',
    category: 'Women / Dresses',
    price: 34.00,
    discountRate: 0,
    stock: 25,
    status: 'approved',
    image: '/sites/modesy/banner-clothing.jpg',
    createdAt: '2026-09-08'
  },
  {
    id: 2,
    title: 'Men Slim Fit Denim Jacket',
    slug: 'men-slim-fit-denim-jacket',
    category: 'Men / Jackets',
    price: 59.90,
    discountRate: 15,
    stock: 12,
    status: 'approved',
    image: '/sites/modesy/banner-shoes.jpg',
    createdAt: '2026-09-07'
  },
  {
    id: 3,
    title: 'Wireless Bluetooth Headphone Pro',
    slug: 'wireless-bluetooth-headphone-pro',
    category: 'Electronics / Audio',
    price: 79.00,
    discountRate: 20,
    stock: 5,
    status: 'pending',
    image: '/sites/modesy/banner-electronics.jpg',
    createdAt: '2026-09-10'
  },
  {
    id: 4,
    title: 'Retro Leather Casual Sneakers',
    slug: 'retro-leather-casual-sneakers',
    category: 'Shoes / Casual',
    price: 45.00,
    discountRate: 0,
    stock: 0,
    status: 'sold',
    image: '/sites/modesy/banner-shoes.jpg',
    createdAt: '2026-08-25'
  }
];

const mockVendorSales: VendorSale[] = [
  {
    id: 101,
    orderNumber: '#10019',
    buyerName: 'Peter Jone',
    productTitle: 'Floral Print Summer Dress',
    quantity: 2,
    totalPrice: 68.00,
    paymentStatus: 'paid',
    orderStatus: 'processing',
    trackingNumber: 'TRK-9837192',
    createdAt: '2026-09-09'
  },
  {
    id: 102,
    orderNumber: '#10018',
    buyerName: 'Alice Watson',
    productTitle: 'Men Slim Fit Denim Jacket',
    quantity: 1,
    totalPrice: 50.91,
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'DHL-5582910',
    createdAt: '2026-09-09'
  },
  {
    id: 103,
    orderNumber: '#10014',
    buyerName: 'Sarah Jenkins',
    productTitle: 'Retro Leather Casual Sneakers',
    quantity: 1,
    totalPrice: 45.00,
    paymentStatus: 'paid',
    orderStatus: 'completed',
    trackingNumber: 'FEDEX-112348',
    createdAt: '2026-08-30'
  }
];

const mockVendorEarnings: VendorEarning[] = [
  {
    id: 1,
    orderNumber: '#10019',
    totalAmount: 68.00,
    commissionRate: 10,
    commissionAmount: 6.80,
    netEarning: 61.20,
    createdAt: '2026-09-09'
  },
  {
    id: 2,
    orderNumber: '#10018',
    totalAmount: 50.91,
    commissionRate: 10,
    commissionAmount: 5.09,
    netEarning: 45.82,
    createdAt: '2026-09-09'
  },
  {
    id: 3,
    orderNumber: '#10014',
    totalAmount: 45.00,
    commissionRate: 10,
    commissionAmount: 4.50,
    netEarning: 40.50,
    createdAt: '2026-08-30'
  }
];

const mockVendorPayouts: VendorPayout[] = [
  {
    id: 1,
    payoutMethod: 'PayPal',
    amount: 250.00,
    status: 'completed',
    createdAt: '2026-08-15'
  },
  {
    id: 2,
    payoutMethod: 'Bank Transfer',
    amount: 500.00,
    status: 'completed',
    createdAt: '2026-07-28'
  }
];

const mockVendorCoupons: VendorCoupon[] = [
  {
    id: 1,
    code: 'SUMMER20',
    discountRate: 20,
    type: 'percentage',
    minOrder: 50.00,
    usageLimit: 100,
    usedCount: 14,
    status: true,
    expiryDate: '2026-12-31'
  },
  {
    id: 2,
    code: 'SAVE10',
    discountRate: 10,
    type: 'fixed',
    minOrder: 30.00,
    usageLimit: 50,
    usedCount: 5,
    status: true,
    expiryDate: '2026-11-30'
  }
];

import { marketplaceStore } from './marketplaceStore';

export const vendorService = {
  getOverview: async () => {
    const sales = marketplaceStore.getVendorSales('trendshop');
    const products = marketplaceStore.getProducts().filter(p => p.sellerSlug === 'trendshop');
    const active = sales.filter(s => s.orderStatus === 'processing' || s.orderStatus === 'shipped').length;
    const completed = sales.filter(s => s.orderStatus === 'completed').length;
    const revenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);

    return {
      activeSales: active,
      completedSales: completed,
      totalProducts: products.length,
      balance: revenue * 0.9,
      totalSalesRevenue: revenue,
      recentSales: sales.slice(0, 5)
    };
  },

  getProducts: async (statusFilter?: string) => {
    const storeProducts = marketplaceStore.getProducts();
    const vendorProds: VendorProduct[] = storeProducts.map(p => ({
      id: typeof p.id === 'number' ? p.id : parseInt(String(p.id)) || 1,
      title: p.title,
      slug: p.slug,
      category: p.category || 'General',
      price: p.price || 0,
      discountRate: p.discountPercent || 0,
      stock: p.stock || 15,
      status: 'approved',
      image: p.image || '/sites/modesy/banner-clothing.jpg',
      createdAt: p.createdAt || '2026-09-08'
    }));

    if (!statusFilter || statusFilter === 'all') {
      return vendorProds;
    }
    return vendorProds.filter(p => p.status === statusFilter);
  },

  addProduct: async (data: Partial<VendorProduct>) => {
    const created = await createNewProduct({
      title: data.title,
      category: data.category,
      price: data.price,
      image: data.image,
      stock: data.stock,
      status: 'pending',
      sellerName: 'Trendshop',
      sellerSlug: 'trendshop'
    });

    return {
      id: typeof created.id === 'number' ? created.id : Date.now(),
      title: created.title,
      slug: created.slug,
      category: created.category || 'General',
      price: created.price || 0,
      discountRate: 0,
      stock: created.stock || 10,
      status: 'approved' as const,
      image: created.image || '/sites/modesy/banner-clothing.jpg',
      createdAt: new Date().toISOString().split('T')[0]
    };
  },

  deleteProduct: async (id: number) => {
    return marketplaceStore.deleteProduct(id);
  },

  getSales: async (statusFilter?: string) => {
    const sales = marketplaceStore.getVendorSales('trendshop');
    if (!statusFilter || statusFilter === 'all') {
      return sales;
    }
    return sales.filter(s => s.orderStatus === statusFilter);
  },

  updateSaleStatus: async (id: number, status: VendorSale['orderStatus'], trackingNumber?: string) => {
    const sales = marketplaceStore.getVendorSales('trendshop');
    const target = sales.find(s => s.id === id);
    if (target) {
      marketplaceStore.updateSaleStatus(target.orderNumber, status, trackingNumber);
      return { ...target, orderStatus: status, trackingNumber };
    }
    return null;
  },

  getEarnings: async () => {
    const sales = marketplaceStore.getVendorSales('trendshop');
    return sales.map((s, idx) => ({
      id: s.id || idx + 1,
      orderNumber: `#${s.orderNumber}`,
      totalAmount: s.totalPrice,
      commissionRate: 10,
      commissionAmount: parseFloat((s.totalPrice * 0.1).toFixed(2)),
      netEarning: parseFloat((s.totalPrice * 0.9).toFixed(2)),
      createdAt: s.createdAt
    }));
  },

  getPayouts: async () => {
    return mockVendorPayouts;
  },

  requestPayout: async (amount: number, method: VendorPayout['payoutMethod']) => {
    const newPayout: VendorPayout = {
      id: Date.now(),
      payoutMethod: method,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockVendorPayouts.unshift(newPayout);
    return newPayout;
  },

  getCoupons: async () => {
    return mockVendorCoupons;
  },

  createCoupon: async (coupon: Omit<VendorCoupon, 'id' | 'usedCount'>) => {
    const newCoupon: VendorCoupon = {
      ...coupon,
      id: Date.now(),
      usedCount: 0
    };
    mockVendorCoupons.unshift(newCoupon);
    return newCoupon;
  },

  deleteCoupon: async (id: number) => {
    const idx = mockVendorCoupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      mockVendorCoupons.splice(idx, 1);
      return true;
    }
    return false;
  }
};
