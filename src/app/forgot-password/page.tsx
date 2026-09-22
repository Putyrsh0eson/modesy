'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#222d32] text-white font-bold text-xl flex items-center justify-center mx-auto shadow">
            M
          </div>
          <h1 className="text-xl font-bold text-gray-900 pt-2">Reset Password</h1>
          <p className="text-xs text-gray-500">Enter your account email to receive a password reset link</p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-700">
              A password reset link has been dispatched to <span className="font-semibold text-gray-900">{email}</span>. Please check your inbox.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Account Email
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

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#222d32] hover:bg-gray-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
