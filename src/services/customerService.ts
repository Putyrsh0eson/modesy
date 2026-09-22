export interface CustomerOrder {
  id: number;
  orderNumber: string;
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'completed' | 'cancelled';
  itemsCount: number;
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
  };
  items: Array<{
    id: number;
    title: string;
    sku: string;
    price: number;
    quantity: number;
    vendor: string;
    image: string;
  }>;
}

export interface ShippingAddress {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

const mockCustomerOrders: CustomerOrder[] = [
  {
    id: 1,
    orderNumber: '#10019',
    totalPrice: 182.10,
    currency: 'USD',
    paymentMethod: 'Wallet Balance',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    itemsCount: 2,
    createdAt: '2026-09-09 11:39',
    shippingAddress: {
      name: 'Peter Jone',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'Oregon',
      country: 'United States',
      phone: '+1 555-0199'
    },
    items: [
      {
        id: 1,
        title: 'Floral Print Summer Dress',
        sku: 'F1W2S3D4R5S6-Dark-S',
        price: 34.00,
        quantity: 2,
        vendor: 'Trendshop',
        image: '/sites/modesy/banner-clothing.jpg'
      },
      {
        id: 2,
        title: 'Wireless Bluetooth Headphone Pro',
        sku: 'WB-HP-PRO-BLK',
        price: 114.10,
        quantity: 1,
        vendor: 'TechStore',
        image: '/sites/modesy/banner-electronics.jpg'
      }
    ]
  },
  {
    id: 2,
    orderNumber: '#10011',
    totalPrice: 194.20,
    currency: 'USD',
    paymentMethod: 'Wallet Balance',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    itemsCount: 1,
    createdAt: '2026-08-31 18:56',
    shippingAddress: {
      name: 'Peter Jone',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'Oregon',
      country: 'United States',
      phone: '+1 555-0199'
    },
    items: [
      {
        id: 3,
        title: 'Men Slim Fit Denim Jacket',
        sku: 'DJ-SLIM-M',
        price: 194.20,
        quantity: 1,
        vendor: 'Trendshop',
        image: '/sites/modesy/banner-shoes.jpg'
      }
    ]
  }
];

const mockAddresses: ShippingAddress[] = [
  {
    id: 1,
    title: 'Home Address',
    firstName: 'Peter',
    lastName: 'Jone',
    email: 'peter.jone@example.com',
    phone: '+1 555-0199',
    address: '742 Evergreen Terrace',
    country: 'United States',
    state: 'Oregon',
    city: 'Springfield',
    zipCode: '97477',
    isDefault: true
  },
  {
    id: 2,
    title: 'Office',
    firstName: 'Peter',
    lastName: 'Jone',
    email: 'peter.jone@work.com',
    phone: '+1 555-0188',
    address: '100 Industrial Parkway, Suite 400',
    country: 'United States',
    state: 'Oregon',
    city: 'Springfield',
    zipCode: '97478',
    isDefault: false
  }
];

import { marketplaceStore } from './marketplaceStore';

export const customerService = {
  getOrders: async (): Promise<CustomerOrder[]> => {
    const orders = marketplaceStore.getOrders();
    return orders.map(o => ({
      id: parseInt(o.id) || 1,
      orderNumber: o.orderNumber,
      totalPrice: o.total,
      currency: o.currency,
      paymentMethod: o.paymentMethod,
      paymentStatus: 'paid',
      orderStatus: o.status as CustomerOrder['orderStatus'],
      itemsCount: o.items.length,
      createdAt: o.createdAt,
      shippingAddress: {
        name: o.customer.fullName,
        address: o.customer.address,
        city: o.customer.city,
        state: 'NY',
        country: o.customer.country,
        phone: o.customer.phone
      },
      items: o.items.map((item, idx) => ({
        id: idx + 1,
        title: item.title,
        sku: `SKU-${idx + 100}`,
        price: item.price,
        quantity: item.quantity,
        vendor: item.sellerName,
        image: item.image
      }))
    }));
  },

  getOrderById: async (idOrNumber: string | number): Promise<CustomerOrder | null> => {
    const all = await customerService.getOrders();
    const clean = String(idOrNumber).replace('#', '');
    const found = all.find(o => String(o.id) === clean || o.orderNumber.replace('#', '') === clean);
    return found || all[0] || null;
  },

  getAddresses: async () => {
    return mockAddresses;
  },

  addAddress: async (addr: Omit<ShippingAddress, 'id'>) => {
    const newAddr: ShippingAddress = {
      ...addr,
      id: Date.now()
    };
    if (newAddr.isDefault) {
      mockAddresses.forEach(a => { a.isDefault = false; });
    }
    mockAddresses.push(newAddr);
    return newAddr;
  },

  deleteAddress: async (id: number) => {
    const idx = mockAddresses.findIndex(a => a.id === id);
    if (idx !== -1) {
      mockAddresses.splice(idx, 1);
      return true;
    }
    return false;
  },

  setDefaultAddress: async (id: number) => {
    mockAddresses.forEach(a => {
      a.isDefault = a.id === id;
    });
    return true;
  }
};
