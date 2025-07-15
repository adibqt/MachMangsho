import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Categories from '../components/Categories';
import { categories as staticCategories } from '../assets/assets';

const ProductCategory = () => {
    const { products, categories: contextCategories } = useAppContext();
    const { category } = useParams();

    // Use categories from context if available, otherwise from assets
    const categories = contextCategories && contextCategories.length > 0 ? contextCategories : staticCategories;

    // Loading fallback if products or categories are not loaded yet
    if (!products || products.length === 0 || !categories || categories.length === 0) {
        return <div className="flex items-center justify-center h-[60vh]"><p className="text-xl text-gray-500">Loading...</p></div>;
    }

    // Find category, case-insensitive
    const searchCategory = categories.find(
        (item) => item.path.toLowerCase() === category?.toLowerCase()
    );

    // Filter products by category, case-insensitive
    const filteredProducts = products.filter((product) =>
        product.category && product.category.toLowerCase() === category?.toLowerCase()
    );

    // If category not found, show error
    if (!searchCategory) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-2xl font-medium text-red-500">Category not found.</p>
            </div>
        );
    }

    return (
        <div className='mt-16'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                <div className="w-16 h-0.5 bg-primary rounded-full"></div>
            </div>
            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60vh]'>
                    <p className='text-2xl font-medium text-primary'>No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default ProductCategory;
