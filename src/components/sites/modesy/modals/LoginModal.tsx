'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModesy } from '@/context/ModesyContext';
import { X } from 'lucide-react';

export function LoginModal() {
  const router = useRouter();
  const { isLoginModalOpen, setLoginModalOpen, loginWithCredentials } = useModesy();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
    setError('');
    const result = await loginWithCredentials(email, password);
    if (result.error) {
      setError(result.error);
      setLoggedIn(false);
      return;
    }

    setTimeout(() => {
      setLoginModalOpen(false);
      setLoggedIn(false);
      const currentUser = JSON.parse(localStorage.getItem('modesy_user') || '{}');
      if (currentUser.role === 'admin' || currentUser.role === 'moderator') router.push('/admin');
      else if (currentUser.role === 'vendor') router.push('/dashboard');
    }, 400);
  };

  const handleGoogleLogin = () => {
    setError('Google sign-in must be enabled in Supabase Authentication settings first.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setLoginModalOpen(false)}
      />

      {/* Modal Dialog (Pixel-Perfect to Screenshot 1) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 w-full max-w-[338px] rounded-[6px] bg-white p-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-[#999999] hover:text-[#333333] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 id="login-modal-title" className="text-[26px] font-bold text-[#203145] text-center mb-6">Login</h2>

        {/* Connect with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-[44px] bg-white hover:bg-[#f9fafb] border border-[#dcdfe6] rounded-[4px] flex items-center justify-center gap-3 text-[14px] font-medium text-[#444444] transition-colors shadow-2xs cursor-pointer mb-5"
        >
          {/* Official Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
            />
          </svg>
          <span>Connect with Google</span>
        </button>

        {/* Divider: Or login with email */}
        <div className="text-center text-[13px] text-[#888888] font-normal mb-5">
          Or login with email
        </div>

        {loggedIn ? (
          <div className="py-6 text-center">
            <div className="inline-block p-3 rounded-full bg-teal-50 text-[#00a99d] mb-2">
              <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#203145]">Logging in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && <p className="rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}
            {/* Email Field */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full h-[44px] px-3.5 rounded-[4px] border border-[#dcdfe6] text-[14px] text-[#333333] placeholder-[#888888] focus:outline-none focus:border-[#00a99d] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full h-[44px] px-3.5 rounded-[4px] border border-[#dcdfe6] text-[14px] text-[#333333] placeholder-[#888888] focus:outline-none focus:border-[#00a99d] transition-colors"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                onClick={() => setLoginModalOpen(false)}
                className="text-[13px] text-[#444444] hover:text-[#00a99d] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              className="w-full h-[44px] rounded-[4px] bg-[#00a99d] hover:bg-[#008e84] text-white font-semibold text-[15px] transition-colors shadow-2xs cursor-pointer mt-2"
            >
              Login
            </button>

            {/* Register Link */}
            <div className="text-center text-[13px] text-[#666666] pt-3">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                onClick={() => setLoginModalOpen(false)}
                className="text-[#00a99d] font-semibold hover:underline"
              >
                Register
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
