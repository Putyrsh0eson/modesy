'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, MapPin, CheckCircle, Save, Image as ImageIcon } from 'lucide-react';
import { useModesy } from '@/context/ModesyContext';

export default function ProfileSettingsPage() {
  const { user, login } = useModesy();
  const [firstName, setFirstName] = useState('Peter');
  const [lastName, setLastName] = useState('Jone');
  const [email, setEmail] = useState('peter.jone@example.com');
  const [phone, setPhone] = useState('+1 555-0199');
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || '/images/user.png');

  useEffect(() => {
    if (user?.avatar) setAvatar(user.avatar);
  }, [user?.avatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) login({ ...user, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Account Settings</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#222d32] text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </Link>
          <Link
            href="/settings/shipping-address"
            className="flex items-center gap-2.5 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium transition-colors"
          >
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>Shipping Address Book</span>
          </Link>
        </div>

        {/* Main Settings Form */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5">
          <div>
            <h1 className="text-base font-bold text-gray-900">Personal Information</h1>
            <p className="text-xs text-gray-500 mt-0.5">Update your contact profile and account credentials</p>
          </div>

          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Profile details updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                <Image src={avatar} alt="Profile picture" fill unoptimized className="object-cover" />
              </div>
              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Change Profile Picture
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
                </label>
                <p className="mt-1 text-[11px] text-gray-500">PNG, JPG, or WEBP up to 5 MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-bold shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
