import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
  const {products, axios} = useAppContext();
  const [top, setTop] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await axios.get('/api/product/top?limit=10');
        if (!cancelled && data?.success) {
          setTop((data.products || []).filter(p => p?.name && p.name !== 'Product'));
        }
      } catch (_) {
        // Ignore and let fallback render
      }
    };
    load();
    return () => { cancelled = true; };
  }, [axios]);
  return (
    <div className='mt-8 sm:mt-16'>
        <p className='text-lg sm:text-2xl md:text-3xl font-medium'>BestSeller</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-6 mt-4 sm:mt-6'>
          {(top.length > 0 ? top : products)
            .filter((product) => product?.inStock && product?.name && product.name !== 'Product')
            .slice(0, 5)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
    </div>
  )
}

export default BestSeller