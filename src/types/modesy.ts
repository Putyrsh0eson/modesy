export interface Product {
  id: string | number;
  title: string;
  slug: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  isFree?: boolean;
  requestQuote?: boolean;
  rating: number; // 0 to 5
  wishlistCount: number;
  sellerName: string;
  sellerSlug: string;
  image: string;
  hoverImage?: string;
  galleryImages?: string[];
  category?: string;
  sku?: string;
  stock?: number;
  description?: string;
  specifications?: Record<string, string>;
  status?: 'approved' | 'pending';
  createdAt?: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  image: string;
}

export interface SubCategoryGroup {
  name: string;
  slug: string;
  items: { name: string; slug: string }[];
}

export interface MegaMenuCategory {
  id: string | number;
  name: string;
  slug: string;
  subcategories: SubCategoryGroup[];
  images: { name: string; image: string; slug: string }[];
}

export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export interface PromoBanner {
  id: number;
  title: string;
  link: string;
  image: string;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export interface OrderItem {
  productId: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
}

export interface AuthUser {
  id: string | number;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'vendor' | 'member' | 'customer';
  avatar: string;
  slug: string;
}
