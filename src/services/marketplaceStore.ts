import { ALL_PRODUCTS } from '@/data/modesy-mock';
import { Product, Order, OrderItem } from '@/types/modesy';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface StoreReview {
  id: number;
  productId: string | number;
  productSlug: string;
  productTitle: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  comment: string;
  sellerSlug: string;
  date: string;
}

export interface StoreComment {
  id: number;
  productId: string | number;
  productSlug: string;
  productTitle: string;
  authorName: string;
  authorEmail: string;
  comment: string;
  sellerSlug: string;
  date: string;
}

export interface VendorSaleRecord {
  id: number;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  productTitle: string;
  productId: string | number;
  quantity: number;
  totalPrice: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderStatus: 'processing' | 'shipped' | 'completed' | 'cancelled';
  trackingNumber?: string;
  sellerSlug: string;
  createdAt: string;
}

export interface StoreQuote {
  id: number;
  productTitle: string;
  productSlug: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  proposedPrice: number;
  sellerSlug: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface StoreTransaction {
  id: number;
  orderNumber: string;
  paymentAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  user: string;
  createdAt: string;
}

const STORAGE_KEY = 'modesy_marketplace_store_v3';

class MarketplaceStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private vendorSales: VendorSaleRecord[] = [];
  private transactions: StoreTransaction[] = [];
  private reviews: StoreReview[] = [];
  private comments: StoreComment[] = [];
  private quotes: StoreQuote[] = [];
  private listeners: Set<() => void> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    // 1. Initial Products
    this.products = [...ALL_PRODUCTS];

    // 2. Initial Reviews matching reference
    this.reviews = [
      {
        id: 6,
        productId: '6',
        productSlug: 'black-bag-over-the-shoulder',
        productTitle: 'Black bag over the shoulder',
        authorName: 'Peter Jone',
        authorEmail: 'member@modesy.com',
        rating: 5,
        comment:
          'The material feels durable, and the design is sleek enough to match both casual and formal outfits. It has plenty of space inside without being too bulky, and the strap is comfortable for carrying all day.',
        sellerSlug: 'trendshop',
        date: '2026-08-05 / 13:55'
      }
    ];

    // 3. Initial Vendor Sales matching reference dashboard screenshot (#10024 - #10020)
    this.vendorSales = [
      {
        id: 10024,
        orderNumber: '10024',
        buyerName: 'Peter Jone',
        buyerEmail: 'member@modesy.com',
        productTitle: 'Black bag over the shoulder',
        productId: '6',
        quantity: 1,
        totalPrice: 48.00,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        sellerSlug: 'trendshop',
        createdAt: '2026-09-14 / 16:27'
      },
      {
        id: 10023,
        orderNumber: '10023',
        buyerName: 'Alice Watson',
        buyerEmail: 'alice@example.com',
        productTitle: 'Floral Print Summer Dress',
        productId: '1',
        quantity: 2,
        totalPrice: 68.00,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        sellerSlug: 'trendshop',
        createdAt: '2026-09-14 / 16:20'
      },
      {
        id: 10022,
        orderNumber: '10022',
        buyerName: 'Michael Brown',
        buyerEmail: 'michael@example.com',
        productTitle: 'Casual Denim Jacket',
        productId: '2',
        quantity: 1,
        totalPrice: 55.00,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        sellerSlug: 'trendshop',
        createdAt: '2026-09-14 / 16:08'
      },
      {
        id: 10021,
        orderNumber: '10021',
        buyerName: 'Sophia Clark',
        buyerEmail: 'sophia@example.com',
        productTitle: 'Leather Crossbody Bag',
        productId: '3',
        quantity: 1,
        totalPrice: 42.00,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        sellerSlug: 'trendshop',
        createdAt: '2026-09-14 / 12:26'
      },
      {
        id: 10020,
        orderNumber: '10020',
        buyerName: 'David Miller',
        buyerEmail: 'david@example.com',
        productTitle: 'Vintage Casual Shoes',
        productId: '4',
        quantity: 1,
        totalPrice: 75.00,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        sellerSlug: 'trendshop',
        createdAt: '2026-09-11 / 09:26'
      }
    ];

    // 4. Initial Customer Orders (24 orders matching Modesy reference)
    const initialOrderList: Array<{
      orderNumber: string;
      total: number;
      status: Order['status'];
      createdAt: string;
      buyerName: string;
      buyerEmail: string;
      productTitle: string;
      quantity: number;
    }> = [
      { orderNumber: '10024', total: 67.75, status: 'processing', createdAt: '2026-09-14 / 16:27', buyerName: 'Peter Jone', buyerEmail: 'member@modesy.com', productTitle: 'Black bag over the shoulder', quantity: 1 },
      { orderNumber: '10023', total: 71.95, status: 'processing', createdAt: '2026-09-14 / 16:20', buyerName: 'Alice Watson', buyerEmail: 'alice@example.com', productTitle: 'Floral Print Summer Dress', quantity: 2 },
      { orderNumber: '10022', total: 244.60, status: 'processing', createdAt: '2026-09-14 / 16:08', buyerName: 'Michael Brown', buyerEmail: 'michael@example.com', productTitle: 'Casual Denim Jacket', quantity: 1 },
      { orderNumber: '10021', total: 94.00, status: 'processing', createdAt: '2026-09-14 / 12:26', buyerName: 'Sophia Clark', buyerEmail: 'sophia@example.com', productTitle: 'Leather Crossbody Bag', quantity: 1 },
      { orderNumber: '10020', total: 271.30, status: 'processing', createdAt: '2026-09-11 / 09:26', buyerName: 'David Miller', buyerEmail: 'david@example.com', productTitle: 'Vintage Casual Shoes', quantity: 1 },
      { orderNumber: '10019', total: 182.10, status: 'processing', createdAt: '2026-09-09 / 11:39', buyerName: 'Admin', buyerEmail: 'admin@modesy.com', productTitle: 'Classic Cotton T-Shirt', quantity: 3 },
      { orderNumber: '10018', total: 149.50, status: 'processing', createdAt: '2026-09-09 / 05:59', buyerName: 'Trendshop', buyerEmail: 'vendor@modesy.com', productTitle: 'Running Sports Shoes', quantity: 1 },
      { orderNumber: '10017', total: 87.00, status: 'shipped', createdAt: '2026-09-06 / 02:16', buyerName: 'Peter Jone', buyerEmail: 'member@modesy.com', productTitle: 'Denim Jeans Slim', quantity: 1 },
      { orderNumber: '10016', total: 84.00, status: 'completed', createdAt: '2026-09-06 / 02:15', buyerName: 'Admin', buyerEmail: 'admin@modesy.com', productTitle: 'Formal White Shirt', quantity: 2 },
      { orderNumber: '10015', total: 41.40, status: 'processing', createdAt: '2026-09-06 / 02:14', buyerName: 'Sarah Connor', buyerEmail: 'sarah@example.com', productTitle: 'Cotton Socks Pack', quantity: 4 },
      { orderNumber: '10014', total: 112.00, status: 'completed', createdAt: '2026-09-05 / 14:10', buyerName: 'John Doe', buyerEmail: 'john@example.com', productTitle: 'Winter Wool Scarf', quantity: 2 },
      { orderNumber: '10013', total: 58.50, status: 'completed', createdAt: '2026-09-04 / 11:22', buyerName: 'Emma Stone', buyerEmail: 'emma@example.com', productTitle: 'Canvas Sneaker', quantity: 1 },
      { orderNumber: '10012', total: 220.00, status: 'completed', createdAt: '2026-09-03 / 09:45', buyerName: 'Lucas Grey', buyerEmail: 'lucas@example.com', productTitle: 'Smart Casual Blazer', quantity: 1 },
      { orderNumber: '10011', total: 39.99, status: 'completed', createdAt: '2026-09-02 / 16:30', buyerName: 'Olivia Wilde', buyerEmail: 'olivia@example.com', productTitle: 'Silk Scarf', quantity: 1 },
      { orderNumber: '10010', total: 145.20, status: 'completed', createdAt: '2026-09-01 / 18:15', buyerName: 'Peter Jone', buyerEmail: 'member@modesy.com', productTitle: 'Leather Belt Brown', quantity: 2 },
      { orderNumber: '10009', total: 99.00, status: 'completed', createdAt: '2026-08-30 / 12:00', buyerName: 'William Ross', buyerEmail: 'william@example.com', productTitle: 'Polo Shirt Navy', quantity: 1 },
      { orderNumber: '10008', total: 75.00, status: 'completed', createdAt: '2026-08-28 / 15:40', buyerName: 'Admin', buyerEmail: 'admin@modesy.com', productTitle: 'Summer Fedora Hat', quantity: 1 },
      { orderNumber: '10007', total: 310.00, status: 'completed', createdAt: '2026-08-25 / 10:10', buyerName: 'James Bond', buyerEmail: 'james@example.com', productTitle: 'Italian Leather Shoes', quantity: 1 },
      { orderNumber: '10006', total: 45.00, status: 'completed', createdAt: '2026-08-22 / 14:05', buyerName: 'Rachel Green', buyerEmail: 'rachel@example.com', productTitle: 'Casual Beanie', quantity: 1 },
      { orderNumber: '10005', total: 130.00, status: 'completed', createdAt: '2026-08-20 / 11:30', buyerName: 'Monica Geller', buyerEmail: 'monica@example.com', productTitle: 'Kitchen Apron Deluxe', quantity: 2 },
      { orderNumber: '10004', total: 85.00, status: 'completed', createdAt: '2026-08-18 / 09:12', buyerName: 'Chandler Bing', buyerEmail: 'chandler@example.com', productTitle: 'Sweater Vest Grey', quantity: 1 },
      { orderNumber: '10003', total: 62.00, status: 'completed', createdAt: '2026-08-15 / 16:50', buyerName: 'Joey Tribbiani', buyerEmail: 'joey@example.com', productTitle: 'Leather Jacket Replica', quantity: 1 },
      { orderNumber: '10002', total: 195.00, status: 'completed', createdAt: '2026-08-12 / 13:25', buyerName: 'Phoebe Buffay', buyerEmail: 'phoebe@example.com', productTitle: 'Boho Guitar Strap', quantity: 1 },
      { orderNumber: '10001', total: 54.00, status: 'completed', createdAt: '2026-08-10 / 10:00', buyerName: 'Ross Geller', buyerEmail: 'ross@example.com', productTitle: 'Dinosaur Graphic Tee', quantity: 2 },
    ];

    this.orders = initialOrderList.map(o => ({
      id: o.orderNumber,
      orderNumber: `#${o.orderNumber}`,
      items: [
        {
          productId: '1',
          title: o.productTitle,
          price: o.total,
          quantity: o.quantity,
          image: '/sites/modesy/banner-clothing.jpg',
          sellerName: 'Trendshop'
        }
      ],
      subtotal: o.total,
      shipping: 0,
      tax: 0,
      total: o.total,
      currency: 'USD',
      status: o.status,
      customer: {
        fullName: o.buyerName,
        email: o.buyerEmail,
        phone: '+1 234 567 8900',
        address: '123 Market Street',
        city: 'New York',
        country: 'USA'
      },
      paymentMethod: 'Wallet Balance',
      createdAt: o.createdAt
    }));

    // 5. Initial Transactions matching Modesy Screenshot
    this.transactions = [
      { id: 14, orderNumber: '#10019', paymentAmount: 182.10, currency: 'USD', paymentMethod: 'Wallet Balance', paymentStatus: 'Succeeded', user: 'Admin', createdAt: '2026-09-09 / 11:39' },
      { id: 13, orderNumber: '#10018', paymentAmount: 149.50, currency: 'USD', paymentMethod: 'Wallet Balance', paymentStatus: 'Succeeded', user: 'Trendshop', createdAt: '2026-09-09 / 05:59' },
      { id: 12, orderNumber: '#10017', paymentAmount: 87.00, currency: 'USD', paymentMethod: 'Wallet Balance', paymentStatus: 'Succeeded', user: 'Admin', createdAt: '2026-09-06 / 02:16' },
      { id: 11, orderNumber: '#10016', paymentAmount: 84.00, currency: 'USD', paymentMethod: 'Wallet Balance', paymentStatus: 'Succeeded', user: 'Admin', createdAt: '2026-09-06 / 02:15' },
      { id: 10, orderNumber: '#10015', paymentAmount: 41.40, currency: 'USD', paymentMethod: 'Wallet Balance', paymentStatus: 'Succeeded', user: 'Sarah Connor', createdAt: '2026-09-06 / 02:14' },
      { id: 9, orderNumber: '#10014', paymentAmount: 112.00, currency: 'USD', paymentMethod: 'Stripe', paymentStatus: 'Succeeded', user: 'John Doe', createdAt: '2026-09-05 / 14:10' },
      { id: 8, orderNumber: '#10013', paymentAmount: 58.50, currency: 'USD', paymentMethod: 'PayPal', paymentStatus: 'Succeeded', user: 'Emma Stone', createdAt: '2026-09-04 / 11:22' }
    ];

    // Load persisted state if in browser
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.products?.length) this.products = parsed.products;
          if (parsed.orders?.length) this.orders = parsed.orders;
          if (parsed.vendorSales?.length) this.vendorSales = parsed.vendorSales;
          if (parsed.transactions?.length) this.transactions = parsed.transactions;
          if (parsed.reviews?.length) this.reviews = parsed.reviews;
          if (parsed.comments?.length) this.comments = parsed.comments;
          if (parsed.quotes?.length) this.quotes = parsed.quotes;
        }
      } catch {
        // ignore JSON parse error
      }
    }

    this.initialized = true;
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            products: this.products,
            orders: this.orders,
            vendorSales: this.vendorSales,
            transactions: this.transactions,
            reviews: this.reviews,
            comments: this.comments,
            quotes: this.quotes
          })
        );
      } catch {
        // ignore quota error
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // ================= PRODUCTS API =================
  public getProducts(): Product[] {
    return this.products;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  public addProduct(productData: Partial<Product>, syncToSupabase = true): Product {
    const newProduct: Product = {
      id: Date.now(),
      title: productData.title || 'New Product',
      slug: (productData.slug || productData.title || 'new-product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      category: productData.category || 'Clothing',
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice,
      rating: 5,
      wishlistCount: 0,
      sellerName: productData.sellerName || 'Trendshop',
      sellerSlug: productData.sellerSlug || 'trendshop',
      image: productData.image || '/sites/modesy/banner-clothing.jpg',
      status: productData.status || 'approved',
      stock: productData.stock || 10,
      description: productData.description || '',
      createdAt: new Date().toISOString()
    };

    this.products.unshift(newProduct);
    this.persist();

    // Async Supabase sync if enabled
    if (syncToSupabase && isSupabaseConfigured && supabase) {
      supabase
        .from('products')
        .insert({
          title: newProduct.title,
          slug: newProduct.slug,
          price: newProduct.price,
          category_id: 1,
          user_id: 1
        })
        .then(() => {});
    }

    return newProduct;
  }

  public deleteProduct(id: string | number): boolean {
    const idx = this.products.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      this.products.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  // ================= ORDERS & SALES API =================
  public getOrders(): Order[] {
    return this.orders;
  }

  public getTransactions(): StoreTransaction[] {
    return this.transactions;
  }

  public getPendingProducts(): Product[] {
    return this.products.filter(p => p.status === 'pending');
  }

  public getMembersCount(): number {
    return 7;
  }

  public getCustomerOrders(email?: string): Order[] {
    if (!email) return this.orders;
    return this.orders.filter(o => o.customer.email.toLowerCase() === email.toLowerCase());
  }

  public getVendorSales(sellerSlug?: string): VendorSaleRecord[] {
    if (!sellerSlug) return this.vendorSales;
    return this.vendorSales.filter(vs => vs.sellerSlug.toLowerCase() === sellerSlug.toLowerCase());
  }

  public createOrder(orderData: {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    paymentMethod: string;
    customer: Order['customer'];
  }): Order {
    const rawNumber = String(Math.floor(10025 + Math.random() * 89900));
    const orderNumber = `#${rawNumber}`;
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      id: rawNumber,
      orderNumber,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      currency: 'USD',
      status: 'processing',
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod,
      createdAt: dateStr
    };

    this.orders.unshift(newOrder);

    // Reduce inventory only after the order has been accepted.
    orderData.items.forEach((item) => {
      const product = this.products.find((candidate) => String(candidate.id) === String(item.productId));
      if (product) {
        product.stock = Math.max(0, (product.stock ?? 0) - item.quantity);
      }
    });

    // Map each item to vendor sales
    orderData.items.forEach((item, idx) => {
      const vendorSlug = (item.sellerName || 'Trendshop').toLowerCase().replace(/\s+/g, '-');
      const saleRecord: VendorSaleRecord = {
        id: Number(rawNumber) * 10 + idx,
        orderNumber: rawNumber,
        buyerName: orderData.customer.fullName,
        buyerEmail: orderData.customer.email,
        productTitle: item.title,
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        paymentStatus: 'paid',
        orderStatus: 'processing',
        sellerSlug: vendorSlug,
        createdAt: dateStr
      };
      this.vendorSales.unshift(saleRecord);
    });

    // Generate transaction record
    const maxTxId = this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) : 14;
    const newTx: StoreTransaction = {
      id: maxTxId + 1,
      orderNumber,
      paymentAmount: orderData.total,
      currency: 'USD',
      paymentMethod: orderData.paymentMethod || 'Wallet Balance',
      paymentStatus: 'Succeeded',
      user: orderData.customer.fullName || 'Customer',
      createdAt: dateStr
    };
    this.transactions.unshift(newTx);

    this.persist();

    // Async Supabase sync
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .insert({
          order_number: rawNumber,
          price_total: orderData.total,
          payment_method: orderData.paymentMethod,
          status: 0
        })
        .then(() => {});
    }

    return newOrder;
  }

  public updateSaleStatus(
    orderNumber: string,
    status: VendorSaleRecord['orderStatus'],
    trackingNumber?: string
  ) {
    const cleanNum = orderNumber.replace('#', '');

    // 1. Update vendor sales records
    this.vendorSales.forEach(vs => {
      if (vs.orderNumber === cleanNum) {
        vs.orderStatus = status;
        if (trackingNumber) vs.trackingNumber = trackingNumber;
      }
    });

    // 2. Update customer order record
    this.orders.forEach(o => {
      if (o.orderNumber.replace('#', '') === cleanNum) {
        o.status = status;
      }
    });

    this.persist();
  }

  // ================= REVIEWS & COMMENTS API =================
  public getReviews(): StoreReview[] {
    return this.reviews;
  }

  public getProductReviews(productSlugOrId: string | number): StoreReview[] {
    return this.reviews.filter(
      r =>
        String(r.productId) === String(productSlugOrId) ||
        r.productSlug === String(productSlugOrId)
    );
  }

  public addReview(review: Omit<StoreReview, 'id' | 'date'>): StoreReview {
    const newRev: StoreReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.reviews.unshift(newRev);
    this.persist();
    return newRev;
  }

  public getComments(): StoreComment[] {
    return this.comments;
  }

  public getProductComments(productSlugOrId: string | number): StoreComment[] {
    return this.comments.filter(
      c =>
        String(c.productId) === String(productSlugOrId) ||
        c.productSlug === String(productSlugOrId)
    );
  }

  public addComment(comment: Omit<StoreComment, 'id' | 'date'>): StoreComment {
    const newCom: StoreComment = {
      ...comment,
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.comments.unshift(newCom);
    this.persist();
    return newCom;
  }

  // ================= QUOTES API =================
  public getQuotes(): StoreQuote[] {
    return this.quotes;
  }

  public addQuote(quote: Omit<StoreQuote, 'id' | 'createdAt' | 'status'>): StoreQuote {
    const newQuote: StoreQuote = {
      ...quote,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.quotes.unshift(newQuote);
    this.persist();
    return newQuote;
  }
}

// Global Singleton instance
export const marketplaceStore = new MarketplaceStore();
