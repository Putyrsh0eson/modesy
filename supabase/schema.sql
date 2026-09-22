-- ==============================================================================
-- Modesy Marketplace & Classified Ads - Supabase (PostgreSQL) Database Schema
-- Converted directly from Modesy 2.5.3 official MySQL DDL (install_modesy.sql)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ROLES & PERMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles_permissions (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '{}',
    is_superadmin BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_vendor BOOLEAN DEFAULT FALSE,
    is_member BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. USERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles_permissions(id) ON DELETE SET NULL,
    avatar VARCHAR(500) DEFAULT '/sites/modesy/avatar-admin.jpg',
    balance NUMERIC(12, 2) DEFAULT 0.00,
    number_of_sales INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'banned'
    is_vendor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id INT REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 1,
    visibility BOOLEAN DEFAULT TRUE,
    show_on_homepage BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories_lang (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    lang_id INT DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    product_type VARCHAR(50) DEFAULT 'physical', -- 'physical', 'digital'
    listing_type VARCHAR(50) DEFAULT 'sell_on_site', -- 'sell_on_site', 'ordinary_listing', 'bidding'
    sku VARCHAR(100),
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    discount_rate INT DEFAULT 0,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'approved', -- 'approved', 'pending', 'draft', 'hidden'
    is_promoted BOOLEAN DEFAULT FALSE,
    stock INT DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 0.00,
    pageviews INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_details (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    lang_id INT DEFAULT 1,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    seo_title VARCHAR(500),
    seo_description TEXT,
    seo_keywords VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_default VARCHAR(500) NOT NULL,
    image_big VARCHAR(500),
    image_small VARCHAR(500),
    is_main BOOLEAN DEFAULT FALSE
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    buyer_id INT REFERENCES users(id) ON DELETE SET NULL,
    buyer_type VARCHAR(50) DEFAULT 'registered', -- 'registered', 'guest'
    price_subtotal NUMERIC(12, 2) DEFAULT 0.00,
    price_vat NUMERIC(12, 2) DEFAULT 0.00,
    price_shipping NUMERIC(12, 2) DEFAULT 0.00,
    price_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    price_currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(100) DEFAULT 'Wallet Balance',
    payment_status VARCHAR(50) DEFAULT 'payment_received', -- 'awaiting_payment', 'payment_received'
    order_status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'cancelled', 'shipped'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    seller_id INT REFERENCES users(id) ON DELETE SET NULL,
    buyer_id INT REFERENCES users(id) ON DELETE SET NULL,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_title VARCHAR(500),
    product_slug VARCHAR(500),
    product_unit_price NUMERIC(12, 2) NOT NULL,
    product_quantity INT DEFAULT 1,
    product_total_price NUMERIC(12, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'order_processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. TRANSACTIONS (1:1 with Modesy table `transactions`)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    order_number VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Succeeded', -- 'Succeeded', 'paid', 'COMPLETED'
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. EARNINGS & PAYOUTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS earnings (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL,
    order_product_id INT REFERENCES order_products(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    commission_rate INT DEFAULT 10,
    shipping_cost NUMERIC(12, 2) DEFAULT 0.00,
    earned_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payouts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    payout_method VARCHAR(100) DEFAULT 'iban',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS general_settings (
    id SERIAL PRIMARY KEY,
    application_name VARCHAR(255) DEFAULT 'Modesy',
    site_title VARCHAR(500) DEFAULT 'Modesy - Marketplace and Classified Ads Script',
    site_description TEXT,
    keywords VARCHAR(1000),
    default_currency VARCHAR(10) DEFAULT 'USD',
    commission_rate INT DEFAULT 10,
    physical_products_system BOOLEAN DEFAULT TRUE,
    digital_products_system BOOLEAN DEFAULT TRUE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. VARIATIONS & OPTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS variations (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    parent_id INT DEFAULT 0,
    label_names JSONB DEFAULT '{"1": "Color"}',
    variation_type VARCHAR(50) DEFAULT 'radio_button', -- 'radio_button', 'dropdown', 'checkbox'
    insert_type VARCHAR(50) DEFAULT 'new',
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS variation_options (
    id SERIAL PRIMARY KEY,
    variation_id INT NOT NULL REFERENCES variations(id) ON DELETE CASCADE,
    parent_id INT DEFAULT 0,
    option_names JSONB DEFAULT '{"1": "Black"}',
    stock INT DEFAULT 10,
    color VARCHAR(50),
    price NUMERIC(12, 2) DEFAULT 0.00,
    discount_rate INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    use_default_price BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 12. COUPONS & DISCOUNTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coupon_code VARCHAR(100) NOT NULL UNIQUE,
    discount_rate INT DEFAULT 10,
    coupon_type VARCHAR(50) DEFAULT 'percentage', -- 'percentage', 'fixed'
    minimum_order_amount NUMERIC(12, 2) DEFAULT 0.00,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons_used (
    id SERIAL PRIMARY KEY,
    coupon_id INT NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 13. SHIPPING SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shipping_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'Home',
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(100),
    address VARCHAR(500) NOT NULL,
    country_id INT DEFAULT 1,
    state VARCHAR(255),
    city VARCHAR(255),
    zip_code VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipping_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipping_zone_methods (
    id SERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    cost NUMERIC(12, 2) DEFAULT 0.00,
    status BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 14. REVIEWS & COMMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    parent_id INT DEFAULT 0,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 15. LIVE CHAT & MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(500) DEFAULT 'Product inquiry',
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable browser subscriptions for live conversations in Supabase Realtime.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 16. INVOICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_number VARCHAR(100) NOT NULL,
    client_username VARCHAR(255),
    client_first_name VARCHAR(255),
    client_last_name VARCHAR(255),
    client_email VARCHAR(255),
    client_phone_number VARCHAR(100),
    client_address VARCHAR(500),
    client_country VARCHAR(255),
    client_state VARCHAR(255),
    client_city VARCHAR(255),
    client_tax_number VARCHAR(100),
    country_code VARCHAR(10) DEFAULT 'US',
    price NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 17. REFUND REQUESTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refund_requests (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_number VARCHAR(100) NOT NULL,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refund_requests_messages (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES refund_requests(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_buyer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 18. MEMBERSHIP & PAYOUT ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS membership_plans (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    number_of_ads INT DEFAULT 100,
    duration INT DEFAULT 30, -- in days
    price NUMERIC(12, 2) DEFAULT 0.00,
    is_popular BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users_payout_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    payout_method VARCHAR(50) DEFAULT 'bank', -- 'paypal', 'bank', 'swift'
    paypal_email VARCHAR(255),
    bank_full_name VARCHAR(255),
    bank_country VARCHAR(255),
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_iban VARCHAR(100),
    swift_code VARCHAR(100)
);

-- ------------------------------------------------------------------------------
-- 19. BLOG SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    lang_id INT DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    lang_id INT DEFAULT 1,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    category_id INT REFERENCES blog_categories(id) ON DELETE SET NULL,
    image_default VARCHAR(500),
    image_small VARCHAR(500),
    hit INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 20. PAYMENT SETTINGS & CURRENCIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_settings (
    id SERIAL PRIMARY KEY,
    paypal_enabled BOOLEAN DEFAULT TRUE,
    stripe_enabled BOOLEAN DEFAULT TRUE,
    razorpay_enabled BOOLEAN DEFAULT TRUE,
    midtrans_enabled BOOLEAN DEFAULT TRUE,
    cash_on_delivery_enabled BOOLEAN DEFAULT TRUE,
    bank_transfer_enabled BOOLEAN DEFAULT TRUE,
    wallet_balance_enabled BOOLEAN DEFAULT TRUE,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    default_currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(10) DEFAULT '$'
);

-- ==============================================================================
-- SEED DATA (Converts default records from install_modesy.sql)
-- ==============================================================================

-- 1. Roles
INSERT INTO roles_permissions (id, role_name, is_superadmin, is_admin, is_vendor, is_member)
VALUES 
(1, 'Super Admin', TRUE, TRUE, TRUE, TRUE),
(2, 'Vendor', FALSE, FALSE, TRUE, TRUE),
(3, 'Member', FALSE, FALSE, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Users
INSERT INTO users (id, username, slug, email, password_hash, role_id, is_vendor, status, balance)
VALUES
(1, 'Admin', 'admin', 'admin@codingest.net', '$2y$10$demo_hash_modesy_superadmin_1234', 1, TRUE, 'active', 2450.00),
(2, 'Trendshop', 'trendshop', 'trendshop@codingest.net', '$2y$10$demo_hash_modesy_vendor_1234', 2, TRUE, 'active', 1845.50),
(3, 'Peter Jone', 'peter-jone', 'peter.jone@example.com', '$2y$10$demo_hash_modesy_member_1234', 3, FALSE, 'active', 320.00)
ON CONFLICT (id) DO NOTHING;

-- 3. Settings
INSERT INTO general_settings (id, application_name, site_title, default_currency, commission_rate)
VALUES (1, 'Modesy', 'Modesy - Marketplace and Classified Ads Script', 'USD', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_settings (id, paypal_enabled, stripe_enabled, razorpay_enabled, midtrans_enabled, cash_on_delivery_enabled, bank_transfer_enabled, wallet_balance_enabled, commission_rate)
VALUES (1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 10.00)
ON CONFLICT (id) DO NOTHING;

-- 4. Transactions (The exact 14 rows from Modesy demo)
INSERT INTO transactions (id, order_number, user_id, payment_method, payment_id, currency, payment_amount, payment_status, ip_address, created_at)
VALUES
(14, '#10019', 1, 'Wallet Balance', 'WLT-HM4MT6J7A3-AIXH8H5T', 'USD', 182.10, 'Succeeded', '172.68.229.124', '2026-09-09 11:39:00'),
(13, '#10018', 2, 'Wallet Balance', 'WLT-HM4DEPBGV6-9XPB2QA3', 'USD', 149.50, 'Succeeded', '172.68.221.156', '2026-09-09 05:59:00'),
(12, '#10017', 1, 'Wallet Balance', 'WLT-HM0W7NI87E-3SJTUOFD', 'USD', 87.00, 'Succeeded', '104.23.195.94', '2026-09-06 02:16:00'),
(11, '#10016', 1, 'Wallet Balance', 'WLT-HM0W6GQAGA-AOKXNME9', 'USD', 84.00, 'Succeeded', '104.23.195.94', '2026-09-06 02:15:00'),
(10, '#10015', 1, 'Wallet Balance', 'WLT-HM0W4Y4BY2-9BJDIM36', 'USD', 41.40, 'Succeeded', '104.23.195.94', '2026-09-06 02:14:00'),
(9, '#10011', 1, 'Wallet Balance', 'WLT-HLV1MQ3F5S-5AYH9YJU', 'USD', 194.20, 'Succeeded', '162.158.229.162', '2026-08-31 18:56:00'),
(8, '#10010', 1, 'Wallet Balance', 'WLT-HLUZF0YA5H-8AWAC01O', 'USD', 245.60, 'Succeeded', '104.23.175.101', '2026-08-31 17:37:00'),
(7, '#10008', 1, 'Wallet Balance', 'WLT-HATWEJHEOK-D2Z3UX2O', 'USD', 28.75, 'Succeeded', '78.190.31.52', '2026-08-05 13:57:00'),
(6, '#10007', 3, 'Stripe', 'pi_3S3y9YBHw47ba9xU0uTNl58c', 'USD', 32.86, 'paid', '78.190.31.52', '2026-08-05 13:50:00'),
(5, '#10005', 2, 'Stripe', 'pi_3S3y59BHw47ba9xU00mnObsH', 'USD', 60.77, 'paid', '78.190.31.52', '2026-08-05 13:45:00'),
(4, '#10004', 2, 'Wallet Balance', 'WLT-HATVCWWP0L-4WJQLFL5', 'USD', 160.00, 'Succeeded', '78.190.31.52', '2026-08-05 13:19:00'),
(3, '#10003', 1, 'PayPal', '1C076294SK195350R', 'USD', 116.39, 'COMPLETED', '78.190.31.52', '2026-08-05 13:01:00'),
(2, '#10002', 1, 'Stripe', 'pi_3S3caGBHw47ba9xU1UU6uoQE', 'USD', 150.84, 'paid', '78.190.31.52', '2026-08-04 14:48:00'),
(1, '#10001', 1, 'PayPal', '1500810614736415N', 'USD', 82.14, 'COMPLETED', '78.190.31.52', '2026-08-04 14:45:00')
ON CONFLICT (id) DO NOTHING;

-- 5. Membership Plans
INSERT INTO membership_plans (id, title, number_of_ads, duration, price, is_popular, is_free)
VALUES
(1, 'Basic Plan', 10, 30, 0.00, FALSE, TRUE),
(2, 'Standard Plan', 50, 90, 19.99, TRUE, FALSE),
(3, 'Unlimited Enterprise', 500, 365, 99.00, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 6. Coupons
INSERT INTO coupons (id, seller_id, coupon_code, discount_rate, coupon_type, minimum_order_amount, usage_limit, used_count, status)
VALUES
(1, 2, 'SUMMER20', 20, 'percentage', 50.00, 100, 14, TRUE),
(2, 2, 'SAVE10', 10, 'fixed', 30.00, 50, 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Blog Categories & Posts
INSERT INTO blog_categories (id, name, slug)
VALUES
(1, 'Fashion Trends', 'fashion-trends'),
(2, 'Tech & Gadgets', 'tech-gadgets'),
(3, 'Marketplace Tips', 'marketplace-tips')
ON CONFLICT (id) DO NOTHING;

INSERT INTO blog_posts (id, title, slug, summary, content, category_id, image_default, hit)
VALUES
(1, 'Top 10 Fashion Trends You Need To Try This Season', 'top-10-fashion-trends-this-season', 'Discover the hottest apparel and streetwear styles taking over this year.', 'Fashion is constantly evolving...', 1, '/sites/modesy/banner-electronics.jpg', 1420),
(2, 'How to Start Your Online Multi-Vendor Store on Modesy', 'how-to-start-online-store', 'A step-by-step guide to onboarding your products and reaching thousands of shoppers.', 'Starting a business has never been easier...', 3, '/sites/modesy/banner-shoes.jpg', 2890)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- SUPABASE AUTH PROFILES
-- Credentials live in auth.users. Editable marketplace fields live in profiles.
-- Run this section in the Supabase SQL Editor after the existing schema.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        avatar VARCHAR(500) DEFAULT '/sites/modesy/avatar-admin.jpg',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
        ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile"
        ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
        ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

INSERT INTO public.profiles (id, username, slug, role)
SELECT
    id,
    COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)),
    lower(regexp_replace(COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 8),
    CASE
        WHEN raw_user_meta_data->>'role' IN ('admin', 'moderator', 'vendor', 'customer') THEN raw_user_meta_data->>'role'
        ELSE 'member'
    END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, slug, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        lower(regexp_replace(COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), '[^a-zA-Z0-9]+', '-', 'g')),
        CASE WHEN NEW.raw_user_meta_data->>'role' = 'vendor' THEN 'vendor' ELSE 'member' END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

