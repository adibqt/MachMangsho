import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [focusedImage, setFocusedImage] = useState(null);
  const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState(''); // 0-100
  const [offerPrice, setOfferPrice] = useState(''); // computed from price & discount

    const {axios} = useAppContext();

    const onSubmitHandler = async (event) =>{
       try {
         event.preventDefault();
         // Sanitize numeric inputs
         const priceNum = Number(price);
         const discNum = discountPercent === '' ? 0 : Number(discountPercent);
         const offerNum = Number(offerPrice);

         if (!Number.isFinite(priceNum) || priceNum < 0) {
           toast.error('Please enter a valid non-negative price');
           return;
         }
         if (!Number.isFinite(discNum) || discNum < 0 || discNum > 100) {
           toast.error('Discount must be between 0 and 100');
           return;
         }
         if (!Number.isFinite(offerNum)) {
           toast.error('Offer price is invalid');
           return;
         }
         if (offerNum > priceNum) {
           toast.error('Offer price cannot be greater than product price');
           return;
         }

         const productData = {
             name,
             description: description.split('\n'),
             category,
             price: Number(priceNum.toFixed(2)),
             offerPrice: Number(offerNum.toFixed(2)),
             discountPercent: Number(discNum.toFixed(2)),
            
         }

         const formData = new FormData();
         formData.append('productData', JSON.stringify(productData));
         files.filter(Boolean).forEach((file) => {
           formData.append('images', file);
         });
       
         // Don't set Content-Type manually; the browser will set the correct multipart boundary
         const {data} = await axios.post('/api/product/add', formData)

         if(data.success){
          toast.success('Product added successfully');
          setName('');
          setDescription('');
          setCategory('');
          setPrice('');
          setDiscountPercent('');
          setOfferPrice('');
          setFiles([]);
         } else{
          toast.error('Failed to add product');}
       } catch (error) {
        toast.error(error.message)
       }
        
    }


  return (
     <div className="no-scrollbar felx-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
  <label key={index} htmlFor={`image${index}`}
    tabIndex={0}
    onFocus={() => setFocusedImage(index)}
    onBlur={() => setFocusedImage(null)}
    onMouseDown={() => setFocusedImage(index)}
    onMouseUp={() => setFocusedImage(null)}
    style={{ outline: 'none' }}
  >
    <input
      onChange={(e) => {
  const updatedFiles = [...files];
  updatedFiles[index] = e.target.files[0];
  setFiles(updatedFiles);
      }}
      accept="image/*"
      type="file"
      id={`image${index}`}
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
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e)=> setName(e.target.value)} value={name}
                    id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-[#c9595a] focus:ring-0" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea onChange={(e)=> setDescription(e.target.value)} value={description}
                    id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-[#c9595a] focus:ring-0 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e)=> setCategory(e.target.value)} value={category}
                    id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-[#c9595a] focus:ring-0">
                        <option value="">Select Category</option>
                       {categories.map((item, index)=> (
                        <option key={index} value={item.path}>{item.path}</option>

                       ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input
                          onChange={(e)=> {
                            // Allow only digits and dot; clamp to >= 0
                            const val = e.target.value;
                            const num = Number(val);
                            if (!val || Number.isFinite(num)) {
                              const clean = Math.max(0, isNaN(num) ? 0 : num);
                              setPrice(val);
                              // Recompute offer based on current discount
                              const disc = discountPercent === '' ? 0 : Number(discountPercent);
                              const computed = Number.isFinite(disc) ? +(clean * (1 - Math.min(100, Math.max(0, disc)) / 100)).toFixed(2) : clean;
                              setOfferPrice(clean === 0 ? 0 : computed);
                            }
                          }}
                          value={price}
                          id="product-price"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="0"
                          className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-[#c9595a] focus:ring-0"
                          required
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="discount-percent">Discount %</label>
                        <input
                          onChange={(e)=> {
                            const val = e.target.value;
                            // Accept empty, else clamp 0-100 with 2 decimals
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
                          value={discountPercent}
                          id="discount-percent"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          max={100}
                          step="0.01"
                          placeholder="0"
                          className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-[#c9595a] focus:ring-0"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input
                          value={offerPrice}
                          id="offer-price"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="0"
                          readOnly
                          title="Offer price is calculated from price and discount"
                          className="bg-gray-50 cursor-not-allowed outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-[#c9595a] focus:ring-0"
                          required
                        />
                    </div>
                </div>
                <button className="px-8 py-2.5 font-medium rounded cursor-pointer text-white" style={{backgroundColor: '#c9595a'}} onMouseOver={e => e.target.style.backgroundColor = '#b04849'} onMouseOut={e => e.target.style.backgroundColor = '#c9595a'}>ADD</button>
            </form>
        </div>
  )
}

export default AddProduct;