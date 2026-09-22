'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  TelegramIcon,
  LinkedinIcon,
  TwitchIcon,
  DiscordIcon,
} from '@/components/icons';
import { Rss } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/', label: 'Facebook' },
  { icon: TwitterIcon, href: 'https://x.com', label: 'Twitter' },
  { icon: InstagramIcon, href: 'https://www.instagram.com', label: 'Instagram' },
  { icon: YoutubeIcon, href: 'https://www.youtube.com/', label: 'Youtube' },
  { icon: TelegramIcon, href: 'https://web.telegram.org/', label: 'Telegram' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/', label: 'LinkedIn' },
  { icon: TwitchIcon, href: 'https://www.twitch.tv/', label: 'Twitch' },
  { icon: DiscordIcon, href: 'https://discord.com/', label: 'Discord' },
  { icon: Rss, href: '/rss-feeds', label: 'RSS' },
];

const CATEGORY_LINKS = [
  { name: 'Clothing', href: '/clothing' },
  { name: 'Shoes', href: '/shoes' },
  { name: 'Home & Living', href: '/home-living' },
  { name: 'Jewelry & Accessories', href: '/jewelry-accessories' },
  { name: 'Toys & Entertainment', href: '/toys-entertainment' },
  { name: 'Graphics & Photos', href: '/graphics-photos' },
  { name: 'Video & Audio', href: '/video-audio' },
  { name: 'Web Templates & Code', href: '/web-templates-code' },
];

const QUICK_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Shops', href: '/shops' },
  { name: 'Help Center', href: '/help-center' },
];

const INFO_LINKS = [
  { name: 'Terms & Conditions', href: '/terms-conditions' },
  { name: 'About Us', href: '/about-us' },
];

const PAYMENT_METHODS = [
  { name: 'visa', icon: '/sites/modesy/visa.svg' },
  { name: 'mastercard', icon: '/sites/modesy/mastercard.svg' },
  { name: 'maestro', icon: '/sites/modesy/maestro.svg' },
  { name: 'amex', icon: '/sites/modesy/amex.svg' },
  { name: 'discover', icon: '/sites/modesy/discover.svg' },
];

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 2500);
    }
  };

  return (
    <footer id="footer" className="bg-[#f8f9fa] border-t border-[#e9ecef] text-[#666666]">
      <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#e9ecef]">
          {/* Column 1: Brand About & Social (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/sites/modesy/logo.svg"
                alt="Modesy"
                width={160}
                height={60}
                className="h-[44px] w-auto"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-[#666666]">
              Modesy is a modern e-commerce marketplace where buyers and sellers connect with ease.
              Whether you are looking to shop for unique items or grow your business by selling online,
              Modesy is here to help you every step of the way.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 pt-1">
              {SOCIAL_LINKS.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                    className="w-7.5 h-7.5 rounded-full bg-white border border-[#dee2e6] hover:bg-[#00a99d] hover:border-[#00a99d] hover:text-white text-[#666666] flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Categories (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-[14px] font-bold text-[#222222] mb-3.5 pb-2 border-b border-[#e9ecef] inline-block">
              Categories
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              {CATEGORY_LINKS.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00a99d] hover:translate-x-0.5 inline-block transition-transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links & Information (2 cols) */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <h4 className="text-[14px] font-bold text-[#222222] mb-3 pb-2 border-b border-[#e9ecef] inline-block">
                Quick Links
              </h4>
              <ul className="space-y-2 text-[12.5px]">
                {QUICK_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="hover:text-[#00a99d] hover:translate-x-0.5 inline-block transition-transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold text-[#222222] mb-2.5 pb-1.5 border-b border-[#e9ecef] inline-block">
                Information
              </h4>
              <ul className="space-y-2 text-[12.5px]">
                {INFO_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="hover:text-[#00a99d] hover:translate-x-0.5 inline-block transition-transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Payment Badges (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <h4 className="text-[14px] font-bold text-[#222222] mb-2 pb-2 border-b border-[#e9ecef] inline-block">
                Newsletter
              </h4>
              <p className="text-[12px] text-[#666666] mb-3">
                Join our subscribers list to get the latest news, updates and special offers directly in your inbox
              </p>

              {subscribed ? (
                <div className="p-2.5 bg-[#e6f6f5] border border-[#00a99d] rounded text-[12px] font-semibold text-[#00a99d]">
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full h-9.5 px-3 rounded border border-[#dee2e6] bg-white text-[13px] text-[#333333] focus:outline-none focus:border-[#00a99d]"
                  />
                  <button
                    type="submit"
                    className="w-full h-9.5 rounded bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[13px] transition-colors shadow-xs cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Payment Method Badges */}
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold text-[#888888] block mb-2">
                Accepted Payments
              </span>
              <div className="flex items-center gap-2">
                {PAYMENT_METHODS.map((pm, idx) => (
                  <div
                    key={idx}
                    className="w-9.5 h-6.5 rounded border border-[#dee2e6] bg-white flex items-center justify-center p-1"
                  >
                    <Image
                      src={pm.icon}
                      alt={pm.name}
                      width={30}
                      height={20}
                      className="object-contain h-3.5 w-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#888888]">
          <div>Copyright 2025 Modesy - All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[#00a99d] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-[#00a99d] transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
