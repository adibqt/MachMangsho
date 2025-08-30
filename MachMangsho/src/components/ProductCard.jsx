import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems,navigate} = useAppContext();

    if (!product) return null;

    return (
        <div onClick={() => {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0);}} className="border border-gray-500/20 rounded-md px-2 sm:px-3 md:px-4 py-2 bg-white w-full max-w-xs mx-auto">
            <div className="group cursor-pointer flex items-center justify-center px-1 sm:px-2">
                <img 
                    className="group-hover:scale-105 transition w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain" 
                    src={product.images?.[0] || assets.upload_area} 
                    alt={product.name} 
                />
            </div>
            <div className="text-gray-500/60 text-xs sm:text-sm">
                <p className="text-xs">{product.category}</p>
                <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg truncate w-full">{product.name}</p>
                
                {/* Star Rating */}
                <div className="flex items-center gap-0.5 my-1">
                    {Array(5).fill('').map((_, i) => (
                        <svg 
                            key={i} 
                            className="w-2.5 sm:w-3 md:w-3.5" 
                            viewBox="0 0 24 24" 
                            fill={i < 4 ? '#c9595a' : 'none'} 
                            stroke="#c9595a"
                            strokeWidth="2"
                        >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                    ))} 
                    <p style={{color: '#c9595a'}} className="text-xs">(4)</p>
                </div>
                {/* Price and Cart */}
                <div className="flex items-end justify-between mt-2 sm:mt-3">
                    <p className="text-sm sm:text-base md:text-xl font-medium" style={{color: '#c9595a'}}>
                        {currency}{product.offerPrice} 
                        <span className="text-gray-500/60 text-xs sm:text-sm line-through ml-1 sm:ml-2">
                            {currency}{product.price}
                        </span>
                    </p>
                    
                    <div onClick={(e) => {e.stopPropagation();}} style={{color: '#c9595a'}}>
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-1 border w-12 h-7 sm:w-16 sm:h-8 md:w-20 md:h-[34px] rounded font-medium text-xs sm:text-sm" 
                                style={{
                                    backgroundColor: '#f9e6e6',
                                    borderColor: '#c9595a',
                                    color: '#c9595a'
                                }}
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart_icon" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        ) : (
                            <div 
                                className="flex items-center justify-center gap-1 w-12 h-7 sm:w-16 sm:h-8 md:w-20 md:h-[34px] rounded select-none"
                                style={{backgroundColor: 'rgba(201, 89, 90, 0.15)'}}
                            >
                                <button 
                                    onClick={() => removeFromCart(product._id)} 
                                    className="cursor-pointer text-sm px-1 h-full"
                                    style={{color: '#c9595a'}}
                                >
                                    -
                                </button>
                                <span className="text-xs sm:text-sm text-center min-w-[12px]" style={{color: '#c9595a'}}>
                                    {cartItems[product._id]}
                                </span>
                                <button 
                                    onClick={() => addToCart(product._id)} 
                                    className="cursor-pointer text-sm px-1 h-full"
                                    style={{color: '#c9595a'}}
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;