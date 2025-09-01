import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets, categories } from '../../assets/assets';
import toast from 'react-hot-toast';

const EditProductModal = ({ open, productId, initialProduct, onUpdated, onClose }) => {
  const { axios, currency } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [files, setFiles] = useState([]); // optional new images (replace)
  const [focusedImage, setFocusedImage] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);

  const reset = () => {
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setDiscountPercent('');
    setOfferPrice('');
    setInStock(true);
    setFiles([]);
    setCurrentImages([]);
  };

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setLoading(true);
        const base = initialProduct;
        if (base) {
          hydrate(base);
        } else if (productId) {
          const { data } = await axios.get(`/api/product/${productId}`);
          if (data?.success && data?.product) hydrate(data.product);
          else toast.error(data?.message || 'Failed to load product');
        }
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, productId]);

  const hydrate = (p) => {
    setName(p?.name || '');
    setDescription(Array.isArray(p?.description) ? p.description.join('\n') : (p?.description || ''));
    setCategory(p?.category || '');
    setPrice(String(p?.price ?? ''));
    setDiscountPercent(p?.discountPercent === 0 || p?.discountPercent ? String(p.discountPercent) : '');
    // If discount present, recompute offer from price & discount; else use stored offerPrice
    const priceNum = Number(p?.price || 0);
    const disc = p?.discountPercent === 0 || p?.discountPercent ? Number(p.discountPercent) : undefined;
    const computed = typeof disc === 'number' ? +(priceNum * (1 - Math.min(100, Math.max(0, disc)) / 100)).toFixed(2) : (p?.offerPrice ?? priceNum);
    setOfferPrice(String(computed));
    setInStock(Boolean(p?.inStock));
    setCurrentImages(Array.isArray(p?.images) ? p.images : []);
    setFiles([]);
  };

  const close = () => {
    if (saving) return;
    onClose?.();
    // Don't reset immediately to allow closing animation in future; keep state
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!productId) return;
    try {
      setSaving(true);
      // Sanitize numerics
      const priceNum = Number(price);
      const discNum = discountPercent === '' ? undefined : Number(discountPercent);
      let offerNum = Number(offerPrice);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        toast.error('Please enter a valid non-negative price');
        return;
      }
      if (discNum !== undefined && (!Number.isFinite(discNum) || discNum < 0 || discNum > 100)) {
        toast.error('Discount must be between 0 and 100');
        return;
      }
      if (!Number.isFinite(offerNum)) offerNum = priceNum;
      if (offerNum > priceNum) {
        toast.error('Offer price cannot be greater than product price');
        return;
      }

      const productData = {
        name: name.trim(),
        description: description.split('\n').map((s) => s.trim()).filter(Boolean),
        category: category.trim(),
        price: Number(priceNum.toFixed(2)),
        offerPrice: Number(offerNum.toFixed(2)),
        ...(discNum !== undefined ? { discountPercent: Number(discNum.toFixed(2)) } : {}),
        inStock,
      };

      if (files.filter(Boolean).length > 0) {
        const formData = new FormData();
        formData.append('productData', JSON.stringify(productData));
        files.filter(Boolean).forEach((file) => formData.append('images', file));
        const { data } = await axios.put(`/api/product/update/${productId}`, formData);
        if (data?.success) {
          toast.success('Product updated');
          onUpdated?.(data.product);
          close();
        } else {
          toast.error(data?.message || 'Update failed');
        }
      } else {
        const { data } = await axios.put(`/api/product/update/${productId}`, productData);
        if (data?.success) {
          toast.success('Product updated');
          onUpdated?.(data.product);
          close();
        } else {
          toast.error(data?.message || 'Update failed');
        }
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={close} />
      <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Product</h3>
          <button onClick={close} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium">Images</p>
                {currentImages?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {currentImages.map((src, i) => (
                      <img key={i} src={src} alt="Current" className="w-16 h-16 object-cover rounded border" />
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Upload to replace all images (optional)</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {Array(4).fill('').map((_, index) => (
                    <label key={index} htmlFor={`edit-image-${index}`}
                      tabIndex={0}
                      onFocus={() => setFocusedImage(index)}
                      onBlur={() => setFocusedImage(null)}
                      onMouseDown={() => setFocusedImage(index)}
                      onMouseUp={() => setFocusedImage(null)}
                      style={{ outline: 'none' }}
                    >
                      <input
                        onChange={(e) => {
                          const updated = [...files];
                          updated[index] = e.target.files[0];
                          setFiles(updated);
                        }}
                        accept="image/*"
                        type="file"
                        id={`edit-image-${index}`}
                        hidden
                      />
                      <img
                        className="max-w-24 cursor-pointer"
                        src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                        alt="uploadArea"
                        width={100}
                        height={100}
                        style={{
                          border: focusedImage === index ? '2px solid #c9595a' : '2px solid transparent',
                          borderRadius: 8,
                          transition: 'border 0.2s',
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="edit-name">Name</label>
                <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-[#c9595a]" required />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="edit-description">Description</label>
                <textarea id="edit-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-[#c9595a] resize-none" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="edit-category">Category</label>
                <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-[#c9595a]">
                  <option value="">Select Category</option>
                  {categories.map((item, idx) => (
                    <option key={idx} value={item.path}>{item.path}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                  <label className="text-sm font-medium" htmlFor="edit-price">Price</label>
                  <input id="edit-price" type="number" inputMode="decimal" min={0} step="0.01" value={price}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = Number(val);
                      if (!val || Number.isFinite(num)) {
                        const clean = Math.max(0, isNaN(num) ? 0 : num);
                        setPrice(val);
                        const disc = discountPercent === '' ? 0 : Number(discountPercent);
                        const computed = Number.isFinite(disc) ? +(clean * (1 - Math.min(100, Math.max(0, disc)) / 100)).toFixed(2) : clean;
                        setOfferPrice(clean === 0 ? 0 : computed);
                      }
                    }}
                    className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-[#c9595a]" required />
                </div>
                <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                  <label className="text-sm font-medium" htmlFor="edit-discount">Discount %</label>
                  <input id="edit-discount" type="number" inputMode="decimal" min={0} max={100} step="0.01" value={discountPercent}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setDiscountPercent('');
                        const priceNum = Number(price) || 0;
                        setOfferPrice(priceNum);
                        return;
                      }
                      const num = Number(val);
                      if (Number.isFinite(num)) {
                        const clamped = Math.max(0, Math.min(100, num));
                        setDiscountPercent(val);
                        const priceNum = Number(price) || 0;
                        const computed = +(priceNum * (1 - clamped / 100)).toFixed(2);
                        setOfferPrice(priceNum === 0 ? 0 : computed);
                      }
                    }}
                    className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-[#c9595a]" />
                </div>
                <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                  <label className="text-sm font-medium" htmlFor="edit-offer">Offer Price</label>
                  <input id="edit-offer" type="number" inputMode="decimal" min={0} step="0.01" value={offerPrice} readOnly
                    title="Offer price is calculated from price and discount" className="bg-gray-50 cursor-not-allowed outline-none py-2 px-3 rounded border border-gray-300 focus:border-[#c9595a]" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm">In Stock</label>
                <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={close} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded text-white" style={{ backgroundColor: saving ? '#b04849' : '#c9595a', opacity: saving ? 0.9 : 1 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
