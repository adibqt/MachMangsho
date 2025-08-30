import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
    const {products, searchQuery} = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if(typeof searchQuery === 'string' && searchQuery.length > 0) {
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) && product.inStock
            ))
        } else {
            setFilteredProducts(products.filter(product => product.inStock));
        }
    }, [products, searchQuery]);

    return (
        <div className='mt-8 sm:mt-16 flex flex-col'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-lg sm:text-xl md:text-2xl font-medium uppercase'>
                    ALL PRO
                    <span className='relative'>
                        DUCTS
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