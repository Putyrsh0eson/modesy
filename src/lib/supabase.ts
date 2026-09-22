import { ALL_PRODUCTS } from '@/data/modesy-mock';
import { Product, Order } from '@/types/modesy';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

// Client instance - only initialized if environment variables are present
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

import { marketplaceStore } from '@/services/marketplaceStore';

export async function getSupabaseProfile(userId: string) {
  if (!supabase) return null;

  const { data } = await supabase
    .from('profiles')
    .select('username, role, avatar, slug')
    .eq('id', userId)
    .maybeSingle();

  return data;
}

export async function getAuthUserProfile(authUser: {
  id: string;
  email?: string;
  user_metadata?: { username?: string; role?: string; avatar?: string };
}) {
  const profile = await getSupabaseProfile(authUser.id);
  const username = profile?.username || authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Member';
  const role = profile?.role || authUser.user_metadata?.role || 'member';
  const validRole = ['admin', 'moderator', 'vendor', 'member', 'customer'].includes(role)
    ? role as 'admin' | 'moderator' | 'vendor' | 'member' | 'customer'
    : 'member';

  return {
    id: authUser.id,
    username,
    email: authUser.email || '',
    role: validRole,
    avatar: authUser.email?.toLowerCase() === 'admin@codingest.net'
      ? '/images/admin-profile.jpg'
      : authUser.email?.toLowerCase() === 'moderator@codingest.net'
      ? '/images/moderator-profile.jpg'
      : authUser.email?.toLowerCase() === 'trendshop@codingest.net'
      ? '/images/trendshop-profile.jpg'
      : authUser.email?.toLowerCase() === 'indi@codingest.net'
      ? '/images/indi-profile.jpg'
      : authUser.email?.toLowerCase() === 'saadan@codingest.net'
      ? '/images/saadan-profile.jpg'
      : authUser.email?.toLowerCase() === 'wibi@codingest.net'
      ? '/images/wibi-profile.jpg'
      : authUser.email?.toLowerCase() === 'geoffrey@codingest.net'
      ? '/images/geoffrey-profile.jpg'
      : authUser.email?.toLowerCase() === 'juan@codingest.net'
      ? '/images/juan-profile.jpg'
      : profile?.avatar || authUser.user_metadata?.avatar || '/sites/modesy/avatar-admin.jpg',
    slug: profile?.slug || username.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured.') };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, username: string, role: 'member' | 'vendor') {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured.') };
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { username, role } },
  });
}

// Product queries
export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const query = supabase.from('products').select('*');
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Product request timed out')), 5000);
      });
      const { data, error } = await Promise.race([query, timeout]);
      if (!error && data && data.length > 0) {
        return marketplaceStore.getProducts();
      }
    } catch (error) {
      console.warn('Supabase product request failed; using local products:', error);
    }
  }
  return marketplaceStore.getProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const found = marketplaceStore.getProductBySlug(slug);
  if (found) return found;
  const products = await getAllProducts();
  const product = products.find((p) => p.slug === slug);
  return product || null;
}

// Order & checkout mutations
export async function submitOrder(orderData: {
  total?: number;
  paymentMethod?: string;
  items?: Order['items'];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  currency?: string;
  customer?: Order['customer'];
  status?: string;
}): Promise<Order> {
  const customer = orderData.customer || {
    fullName: 'Customer',
    email: 'customer@example.com',
    phone: '+1 234 567 890',
    address: '123 Market St',
    city: 'New York',
    country: 'USA',
  };

  const createdOrder = marketplaceStore.createOrder({
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    shipping: orderData.shipping || 0,
    tax: orderData.tax || 0,
    total: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || 'Wallet Balance',
    customer
  });

  return createdOrder;
}

// Product upload mutations
export async function createNewProduct(productData: Partial<Product>): Promise<Product & { success: boolean; product: Product }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const title = productData.title || 'New Product';
      const slug = (productData.slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const { data, error } = await supabase
        .from('products')
        .insert({
          title,
          slug,
          sku: productData.sku,
          price: Number(productData.price) || 0,
          stock: Number(productData.stock) || 0,
          status: productData.status || 'pending',
          category_id: 1,
          user_id: 1,
        })
        .select('*')
        .single();

      if (error) throw new Error(`Supabase product insert failed: ${error.message}`);

      const createdProduct: Product = {
        ...productData,
        id: data.id,
        title: data.title,
        slug: data.slug,
        price: Number(data.price) || 0,
        stock: data.stock || 0,
        image: productData.image || '/sites/modesy/banner-clothing.jpg',
        rating: 0,
        wishlistCount: 0,
        sellerName: productData.sellerName || 'Admin',
        sellerSlug: productData.sellerSlug || 'admin',
        createdAt: data.created_at,
      };

      marketplaceStore.addProduct(createdProduct, false);
      return { ...createdProduct, success: true, product: createdProduct };
    } catch (error) {
      console.warn('Supabase product insert failed; publishing to local marketplace:', error);
    }
  }

  const newProduct = marketplaceStore.addProduct(productData);

  return {
    ...newProduct,
    success: true,
    product: newProduct,
  };
}
