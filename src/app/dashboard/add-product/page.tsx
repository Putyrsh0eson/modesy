'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { vendorService } from '@/services/vendorService';
import { Check, CheckCircle, CloudUpload, Sparkles } from 'lucide-react';

const categories = ['Women / Clothing', 'Women / Shoes', 'Men / Fashion', 'Electronics / Audio', 'Jewelry & Watches'];
const listingOptions = [
  ['sale', 'Add a Product for Sale', 'Add a product to sell on the site'],
  ['ordinary', 'Add a Product or Service as an Ordinary Listing', 'Add a product or service without buy option'],
  ['quote', 'Add a Product to Receive Quote (Price) Requests', 'Add a product without adding a price to get price requests from customers'],
  ['license', 'Add a Product to Sell License Keys', 'Add a product to sell only license keys'],
];

export default function VendorAddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [tags, setTags] = useState('');
  const [productType, setProductType] = useState<'physical' | 'digital'>('physical');
  const [listingType, setListingType] = useState('sale');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addImages = (files: FileList | File[]) => {
    const selected = Array.from(files);
    if (selected.some(file => !file.type.startsWith('image/'))) {
      setError('Please choose image files only.');
      return;
    }
    if (selected.some(file => file.size > 5 * 1024 * 1024)) {
      setError('Each image must be smaller than 5MB.');
      return;
    }
    setError('');
    Promise.all(selected.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Unable to read image'));
      reader.readAsDataURL(file);
    }))).then(nextImages => setImages(current => [...current, ...nextImages])).catch(() => setError('Unable to read the selected image.'));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !category) {
      setError('Please enter a title and select a category.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await vendorService.addProduct({
        title: title.trim(),
        category,
        price: 0,
        discountRate: 0,
        stock: 1,
        image: images[0] || '/sites/modesy/banner-clothing.jpg',
      });
      setSuccess(true);
      window.setTimeout(() => router.push('/dashboard/products'), 1200);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[960px] space-y-5 pb-8">
      <div className="px-4 pt-1 text-center">
        <h1 className="text-xl font-bold text-[#203145]">Add Product</h1>
        <div className="mx-auto mt-3 flex max-w-[550px] items-center">
          <div className="h-0.5 flex-1 bg-[#00b39f]" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#13b89f] text-xs font-bold text-white">1</span>
          <div className="h-0.5 flex-1 bg-[#cbd5df]" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#cbd5df] text-xs font-bold text-white">2</span>
          <div className="h-0.5 flex-1 bg-[#cbd5df]" />
        </div>
        <div className="mx-auto flex max-w-[550px] justify-between px-[16%] pt-2 text-[10px] text-[#777]"><span className="text-[#203145]">General Information</span><span>Details</span></div>
      </div>

      {success && <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"><CheckCircle className="h-4 w-4" />Product created successfully. Redirecting...</div>}
      {error && <div className="rounded border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-4 shadow-sm sm:p-5">
        <section>
          <label className="mb-2 block text-[11px] font-bold text-[#203145]">Images</label>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={event => { if (event.target.files) addImages(event.target.files); event.target.value = ''; }} />
          <div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click(); }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); addImages(event.dataTransfer.files); }} className="cursor-pointer border border-dashed border-[#dbe2ea] bg-[#f8fafc] px-4 py-8 text-center hover:border-[#00b39f]"><CloudUpload className="mx-auto mb-2 h-7 w-7 text-[#b8c7d9]" /><p className="text-[11px] text-[#9aa9bd]">Drag and drop images here or <span className="underline">Browse Files</span></p></div>
          <p className="mt-2 text-[10px] text-[#8b98a8]">ⓘ You can click on the &quot;Main&quot; button on the images to select the main image of your product</p>
          {images.length > 0 && <div className="mt-3 flex gap-2">{images.map((image, index) => <div key={image} className="relative h-16 w-16 overflow-hidden border border-[#00b39f]"><img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />{index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#00b39f] text-center text-[9px] text-white">Main</span>}</div>)}</div>}
        </section>

        <section><label className="mb-2 block text-[11px] font-bold text-[#203145]">Product Type</label><div className="grid gap-4 sm:grid-cols-2">{[['physical', 'Physical', 'A tangible product that you will ship to buyers'], ['digital', 'Digital', 'A digital file that buyers will download']].map(([value, label, help]) => <label key={value} className="flex cursor-pointer gap-2 text-[11px] text-[#39465a]"><input type="radio" checked={productType === value} onChange={() => setProductType(value as 'physical' | 'digital')} /><span><b className="font-medium">{label}</b><small className="block text-[#9aa9bd]">{help}</small></span></label>)}</div></section>

        <section><label className="mb-2 block text-[11px] font-bold text-[#203145]">Listing Type</label><div className="grid gap-4 sm:grid-cols-2">{listingOptions.map(([value, label, help]) => <label key={value} className="flex cursor-pointer gap-2 text-[11px] text-[#39465a]"><input type="radio" checked={listingType === value} onChange={() => setListingType(value)} /><span><b className="font-medium">{label}</b><small className="block text-[#9aa9bd]">{help}</small></span></label>)}</div></section>

        <section><label className="mb-1 block text-[11px] font-bold text-[#203145]">Category</label><select required value={category} onChange={event => setCategory(event.target.value)} className="h-9 w-full border border-[#d7dee8] bg-white px-3 text-[11px] text-[#445166] focus:border-[#00b39f] focus:outline-none"><option value="">Select Category</option>{categories.map(item => <option key={item}>{item}</option>)}</select></section>

        <section className="border border-[#dfe5eb]"><div className="border-b border-[#dfe5eb] bg-[#fafbfc] px-3 py-2 text-[11px] text-[#40516a]">Details: English</div><div className="space-y-3 p-4"><div className="flex justify-end"><button type="button" className="inline-flex items-center gap-1 bg-[#078dff] px-3 py-2 text-[10px] font-semibold text-white"><Sparkles className="h-3 w-3" />Generate with AI</button></div><label className="block text-[11px] font-bold text-[#203145]">Title<input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Title" className="mt-1 h-9 w-full border border-[#d7dee8] px-3 text-[11px] font-normal focus:border-[#00b39f] focus:outline-none" /></label><label className="block text-[11px] font-bold text-[#203145]">Short Description<input value={shortDescription} onChange={event => setShortDescription(event.target.value)} placeholder="Short Description" className="mt-1 h-9 w-full border border-[#d7dee8] px-3 text-[11px] font-normal focus:border-[#00b39f] focus:outline-none" /></label><label className="block text-[11px] font-bold text-[#203145]">Tags <span className="font-normal text-[#9aa9bd]">(Add relevant keywords for your product to increase visibility in search results)</span><input value={tags} onChange={event => setTags(event.target.value)} placeholder="Type tag and hit enter" className="mt-1 h-9 w-full border border-[#d7dee8] px-3 text-[11px] font-normal focus:border-[#00b39f] focus:outline-none" /></label><div><label className="block text-[11px] font-bold text-[#203145]">Description</label><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 inline-flex items-center gap-1 bg-[#13b89f] px-3 py-2 text-[10px] font-bold text-white"><span>▣</span>Add Image</button><div className="mt-1 overflow-hidden rounded border border-[#d7dee8]"><div className="flex flex-wrap items-center gap-4 border-b border-[#e4e9ef] bg-white px-3 py-2 text-[12px] text-[#39465a]"><span>File</span><span>Insert</span><span>Format</span><span>Table</span><span className="ml-2 font-bold">B</span><span className="italic">I</span><span>U</span><span>≡</span><span>☷</span><span>↶</span><span>↷</span><span>⌁</span></div><textarea rows={9} value={description} onChange={event => setDescription(event.target.value)} className="w-full resize-y border-0 p-3 text-[11px] focus:outline-none" /></div></div></div></section>

        <div className="border border-[#dfe5eb] bg-[#fafbfc] px-3 py-2 text-[11px] text-[#40516a]">Details: Arabic (Optional)</div>
        <div className="flex justify-end pt-1"><button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-1.5 bg-[#13b89f] px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[#0da58f] disabled:opacity-50"><Check className="h-3.5 w-3.5" />{isSubmitting ? 'Saving...' : 'Save and Continue'}</button></div>
      </form>
    </div>
  );
}
