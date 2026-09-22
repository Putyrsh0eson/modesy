'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, UserPlus, CheckCircle } from 'lucide-react';
import { signUpWithEmail } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'buyer' | 'vendor'>('buyer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert('Please agree to terms and conditions');
      return;
    }
    setError('');
    const result = await signUpWithEmail(email, password, username, accountType === 'vendor' ? 'vendor' : 'member');
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push(accountType === 'vendor' ? '/dashboard' : '/');
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#222d32] text-white font-bold text-xl flex items-center justify-center mx-auto shadow">
            M
          </div>
          <h1 className="text-xl font-bold text-gray-900 pt-2">Create an Account</h1>
          <p className="text-xs text-gray-500">Join Modesy marketplace as a buyer or seller</p>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Registration successful! Redirecting to your account...
          </div>
        )}
        {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">{error}</div>}

        {/* Account Type Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setAccountType('buyer')}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
              accountType === 'buyer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setAccountType('vendor')}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
              accountType === 'vendor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            I want to Sell (Vendor)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {accountType === 'vendor' ? 'Shop / Brand Name' : 'Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-600">
              I agree to the <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
