import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
    const {products, searchQuery} = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const isDeals = (searchParams.get('filter') || '').toLowerCase() === 'deals';

    useEffect(() => {
        let result = Array.isArray(products)
            ? products.filter((p) => p && p.inStock)
            : [];

        if (isDeals) {
            result = result.filter((p) => {
                const price = Number(p.price);
                const offer = Number(p.offerPrice);
                return Number.isFinite(price) && Number.isFinite(offer) && offer < price;
            });
        }

        if (typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
            const q = searchQuery.toLowerCase();
            result = result.filter((p) => (p.name || '').toLowerCase().includes(q));
        }

        setFilteredProducts(result);
    }, [products, searchQuery, isDeals]);

    return (
        <div className='mt-8 sm:mt-16 flex flex-col'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-lg sm:text-xl md:text-2xl font-medium uppercase'>
                    {isDeals ? 'DE' : 'ALL PRO'}
                    <span className='relative'>
                        {isDeals ? 'ALS' : 'DUCTS'}
                        <span className='absolute bottom-0 left-0 w-full h-0.5 bg-red-500'></span>
                    </span>
                </p>
                <div className='w-12 sm:w-16 h-0.5 bg-primary rounded-full'></div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-6 mt-4 sm:mt-6'>
                {filteredProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default AllProducts