'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { customerService, ShippingAddress } from '@/services/customerService';
import { User, MapPin, Plus, Trash2, X } from 'lucide-react';

export default function ShippingAddressSettingsPage() {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [showModal, setShowModal] = useState(false);

  // New Address Form
  const [title, setTitle] = useState('Home');
  const [firstName, setFirstName] = useState('Peter');
  const [lastName, setLastName] = useState('Jone');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('Oregon');
  const [zipCode, setZipCode] = useState('97477');

  useEffect(() => {
    customerService.getAddresses().then(setAddresses);
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr = await customerService.addAddress({
      title,
      firstName,
      lastName,
      email: 'peter.jone@example.com',
      phone: '+1 555-0199',
      address,
      country: 'United States',
      state,
      city,
      zipCode,
      isDefault: false
    });
    setAddresses(prev => [...prev, newAddr]);
    setShowModal(false);
    setAddress('');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this shipping address?')) {
      await customerService.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = async (id: number) => {
    await customerService.setDefaultAddress(id);
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link href="/settings" className="hover:text-gray-900">Account Settings</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Address Book</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium transition-colors"
          >
            <User className="w-4 h-4 text-gray-400" />
            <span>Profile Details</span>
          </Link>
          <Link
            href="/settings/shipping-address"
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#222d32] text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Shipping Address Book</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-base font-bold text-gray-900">Shipping Addresses</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage delivery destinations for fast checkout</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222d32] hover:bg-gray-800 text-white rounded text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`p-4 rounded-lg border text-xs space-y-2 relative transition-all ${
                  addr.isDefault
                    ? 'border-indigo-500 bg-indigo-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{addr.title}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="text-gray-600 space-y-0.5">
                  <p className="font-semibold text-gray-800">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.address}</p>
                  <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                  <p>{addr.country}</p>
                  <p className="text-gray-400 pt-1">Phone: {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Set as default
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400">Primary delivery address</span>
                  )}

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1 text-gray-400 hover:text-rose-600"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Add Shipping Address</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address Title (e.g. Home, Office)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street name, building, apartment"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#222d32] text-white rounded text-xs font-bold hover:bg-gray-800"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
