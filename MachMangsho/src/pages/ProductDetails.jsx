import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'; // Fix import if needed
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id, category } = useParams();

    console.log("products:", products);
    console.log("id from URL:", id);
    console.log("category from URL:", category);

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    // Fixed: item.id instead of item_id
   const product = products.find((item) => item._id === id);
   console.log("found product:", product);

    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => product.category === item.category && item.inStock && item._id !== product._id);
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

    useEffect(() => {
        setThumbnail(product?.images?.[0] || null);
    }, [product]);

    if (!product) {
        return <div className="mt-12 text-center">Product not found</div>;
    }

    return (
        <div className="mt-6 sm:mt-8 md:mt-12">
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <Link to="/" className="hover:text-[#c9595a]">Home</Link> /
                <Link to="/products" className="hover:text-[#c9595a]"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-[#c9595a]"> {product.category}</Link> /
                <span className="text-[#c9595a]"> {product.name}</span>
            </p>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 mt-4">
                <div className="flex gap-2 sm:gap-3 flex-1">
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {(product.images || []).map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 flex-1 max-w-sm mx-auto lg:max-w-md rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-contain" />
                    </div>
                </div>

                <div className="text-sm w-full lg:w-1/2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1 sm:mt-2">
                        {Array(5).fill('').map((_, i) => (
                            <svg 
                                key={i} 
                                className="w-3 h-3 sm:w-4 sm:h-4" 
                                viewBox="0 0 24 24" 
                                fill={i < 4 ? '#c9595a' : 'none'} 
                                stroke={i < 4 ? '#c9595a' : '#d1d5db'}
                                strokeWidth="1"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                        <p className="text-base ml-2">({4})</p>
                    </div>

                                        <div className="mt-4 sm:mt-6">
                                                {(() => {
                                                        const price = Number(product?.price ?? 0);
                                                        const offer = Number(product?.offerPrice ?? price);
                                                        const hasDiscount = typeof product?.discountPercent === 'number' ? product.discountPercent > 0 : offer < price;
                                                        if (hasDiscount) {
                                                                return (
                                                                        <>
                                                                            <p className="text-lg sm:text-xl md:text-2xl font-medium">MRP:{currency} {offer}
                                                                                <span className="text-gray-500/70 text-sm line-through ml-2">{currency} {price}</span>
                                                                            </p>
                                                                            <span className="text-gray-500/70 text-xs sm:text-sm">(inclusive of all taxes)</span>
                                                                        </>
                                                                );
                                                        }
                                                        return (
                                                                <>
                                                                    <p className="text-lg sm:text-xl md:text-2xl font-medium">MRP:{currency} {price}</p>
                                                                    <span className="text-gray-500/70 text-xs sm:text-sm">(inclusive of all taxes)</span>
                                                                </>
                                                        );
                                                })()}
                                        </div>

                    <p className="text-sm sm:text-base font-medium mt-4 sm:mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70 text-sm sm:text-base">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row items-center mt-6 sm:mt-8 md:mt-10 gap-3 sm:gap-4 text-sm sm:text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3 sm:py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded" >
                            Add to Cart
                        </button>
                        <button onClick={() => {addToCart(product._id); navigate("/cart");}} className="w-full py-3 sm:py-3.5 cursor-pointer font-medium text-white hover:opacity-90 transition rounded" style={{ backgroundColor: '#c9595a' }} >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-12 sm:mt-16 md:mt-20">
                    <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center">
        Related <span className="relative inline-block">Products
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c9595a] rounded-full"></span>
        </span>
    </h2>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-6">
    {relatedProducts.map((relatedProduct) => (
        <ProductCard key={relatedProduct._id} product={relatedProduct} />
    ))}
</div>

<div className="flex justify-center mt-8">
    <button 
        onClick={() => navigate('/products')} 
        className="group flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
        style={{ backgroundColor: '#c9595a' }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#b14a4b'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#c9595a'}
    >
        <span>See More</span>
        <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
</div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;