'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CurrencyOption, LanguageOption, AuthUser } from '@/types/modesy';
import { CURRENCIES, LANGUAGES } from '@/data/modesy-mock';
import { getAuthUserProfile, signInWithEmail, supabase } from '@/lib/supabase';

interface CartItem {
  product: Product;
  quantity: number;
}

export const PRESET_USERS: Record<string, AuthUser> = {
  admin: {
    id: '1',
    username: 'Admin',
    email: 'admin@codingest.net',
    role: 'admin',
    avatar: '/images/admin-profile.jpg',
    slug: 'admin',
  },
  moderator: {
    id: '2',
    username: 'Roger Novak',
    email: 'moderator@codingest.net',
    role: 'moderator',
    avatar: '/images/moderator-profile.jpg',
    slug: 'roger-novak',
  },
  vendor: {
    id: '3',
    username: 'Trendshop',
    email: 'trendshop@codingest.net',
    role: 'vendor',
    avatar: '/images/trendshop-profile.jpg',
    slug: 'trendshop',
  },
  member: {
    id: '4',
    username: 'Peter Jone',
    email: 'member@modesy.com',
    role: 'member',
    avatar: '/sites/modesy/avatar-admin.jpg',
    slug: 'peter-jone',
  },
  saadan: {
    id: '5',
    username: 'Saadan',
    email: 'saadan@codingest.net',
    role: 'member',
    avatar: '/images/saadan-profile.jpg',
    slug: 'saadan',
  }
};

export function hasAdminPanelAccess(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'moderator';
}

export function isVendorRole(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === 'vendor' || user.role === 'admin';
}

interface ModesyContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  wishlistIds: (string | number)[];
  toggleWishlist: (productId: string | number) => void;
  currency: CurrencyOption;
  setCurrency: (c: CurrencyOption) => void;
  language: LanguageOption;
  setLanguage: (l: LanguageOption) => void;
  isLocationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  cartModalProduct: Product | null;
  setCartModalProduct: (p: Product | null) => void;
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
  hasAdminAccess: boolean;
  isVendor: boolean;
}

const ModesyContext = createContext<ModesyContextType | undefined>(undefined);

export function ModesyProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<(string | number)[]>([]);
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [language, setLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [cartModalProduct, setCartModalProduct] = useState<Product | null>(null);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingCartProduct, setPendingCartProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const storageKey = `modesy_cart_${user.id}`;
    let savedItems: CartItem[] = [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) savedItems = JSON.parse(saved) as CartItem[];
    } catch {
      savedItems = [];
    }

    if (pendingCartProduct) {
      setCartModalProduct(pendingCartProduct);
      const existing = savedItems.find((item) => item.product.id === pendingCartProduct.id);
      savedItems = existing
        ? savedItems.map((item) => item.product.id === pendingCartProduct.id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
        : [...savedItems, { product: pendingCartProduct, quantity: 1 }];
      setPendingCartProduct(null);
    }

    setCartItems(savedItems);
    localStorage.setItem(storageKey, JSON.stringify(savedItems));
  }, [user?.id, pendingCartProduct]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const loadCurrentProfile = async (sessionUser: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (!sessionUser) {
        setUser(null);
        localStorage.removeItem('modesy_user');
        return;
      }

      const profile = await getAuthUserProfile({
        id: sessionUser.id,
        email: sessionUser.email,
        user_metadata: {
          username: typeof sessionUser.user_metadata?.username === 'string' ? sessionUser.user_metadata.username : undefined,
          role: typeof sessionUser.user_metadata?.role === 'string' ? sessionUser.user_metadata.role : undefined,
          avatar: typeof sessionUser.user_metadata?.avatar === 'string' ? sessionUser.user_metadata.avatar : undefined,
        },
      });
      setUser(profile);
      localStorage.setItem('modesy_user', JSON.stringify(profile));
    };

    client.auth.getSession().then(({ data }) => loadCurrentProfile(data.session?.user || null));

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      void loadCurrentProfile(session?.user || null);
    });

    const refreshOnFocus = () => {
      void client.auth.getSession().then(({ data }) => loadCurrentProfile(data.session?.user || null));
    };
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem('modesy_user', JSON.stringify(u));
    } catch {
      // ignore
    }

  };

  const loginWithCredentials = async (email: string, password: string) => {
    const { data, error } = await signInWithEmail(email, password);
    if (error || !data.user) {
      return { error: error?.message || 'Unable to sign in.' };
    }

    const profile = await getAuthUserProfile(data.user);
    login(profile);
    return { error: null };
  };

  const logout = () => {
    void supabase?.auth.signOut();
    setUser(null);
    setCartItems([]);
    try {
      localStorage.removeItem('modesy_user');
    } catch {
      // ignore
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product) => {
    if (!user) {
      setPendingCartProduct(product);
      setLoginModalOpen(true);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const nextItems = existing
        ? prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
        : [...prev, { product, quantity: 1 }];
      localStorage.setItem(`modesy_cart_${user.id}`, JSON.stringify(nextItems));
      return nextItems;
    });
    setCartModalProduct(product);
  };

  const removeFromCart = (productId: string | number) => {
    setCartItems((prev) => {
      const nextItems = prev.filter((item) => item.product.id !== productId);
      if (user) localStorage.setItem(`modesy_cart_${user.id}`, JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const toggleWishlist = (productId: string | number) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <ModesyContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        wishlistIds,
        toggleWishlist,
        currency,
        setCurrency,
        language,
        setLanguage,
        isLocationModalOpen,
        setLocationModalOpen,
        isLoginModalOpen,
        setLoginModalOpen,
        cartModalProduct,
        setCartModalProduct,
        isMobileDrawerOpen,
        setMobileDrawerOpen,
        user,
        login,
        loginWithCredentials,
        logout,
        hasAdminAccess: hasAdminPanelAccess(user),
        isVendor: isVendorRole(user),
      }}
    >
      {children}
    </ModesyContext.Provider>
  );
}

export function useModesy() {
  const context = useContext(ModesyContext);
  if (!context) {
    throw new Error('useModesy must be used within a ModesyProvider');
  }
  return context;
}
