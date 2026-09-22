export interface AdminTransaction {
  id: number;
  order: string;
  paymentMethod: string;
  paymentId: string;
  user: string;
  currency: string;
  paymentAmount: number;
  paymentStatus: 'Succeeded' | 'paid' | 'COMPLETED' | 'Failed' | 'Pending';
  ipAddress: string;
  date: string;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  totalAmount: number;
  currency: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  orderStatus: 'Completed' | 'Processing' | 'Cancelled' | 'Shipped';
  itemCount: number;
  date: string;
}

export interface AdminProductItem {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  seller: string;
  status: 'Approved' | 'Pending' | 'Draft';
  featured: boolean;
  image: string;
  createdAt: string;
}

export interface AdminCategoryItem {
  id: number;
  name: string;
  slug: string;
  parentName?: string;
  order: number;
  image?: string;
  productCount: number;
  visibility: boolean;
}

export interface AdminUserItem {
  id: number;
  username: string;
  email: string;
  role: 'Super Admin' | 'Vendor' | 'Member';
  status: 'Active' | 'Banned';
  balance: number;
  joinDate: string;
  avatar: string;
}

export interface AdminEarning {
  id: number;
  orderNumber: string;
  vendorName: string;
  saleAmount: number;
  adminCommission: number;
  vendorEarning: number;
  date: string;
}

export interface AdminStat {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingProducts: number;
}
