'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Contact Us</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Contact info */}
        <div className="p-8 bg-[#222d32] text-white space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Get In Touch</h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              Have questions about an order, selling on Modesy, or partnership inquiries? Reach out to our dedicated team.
            </p>

            <div className="space-y-4 pt-4 text-xs text-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100 Marketplace Blvd, Suite 400, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@modesy.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 555-0199</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700 text-[11px] text-gray-400">
            Support hours: Monday – Friday (9:00 AM – 6:00 PM EST)
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="p-8 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Send us a message</h2>
            <p className="text-xs text-gray-500 mt-0.5">We typically respond within 24 business hours</p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Thank you! Your message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="What is this inquiry about?"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                rows={5}
                required
                placeholder="Write your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#222d32] hover:bg-gray-800 text-white rounded-lg text-xs font-bold shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
