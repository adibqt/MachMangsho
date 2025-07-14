import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems} = useAppContext();

    if (!product) return null;

    return (
        <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img 
                    className="group-hover:scale-105 transition max-w-26 md:max-w-36" 
                    src={product.image[0]} 
                    alt={product.name} 
                />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                
                {/* Star Rating */}
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        <svg 
                            key={i} 
                            className="md:w-3.5 w-3" 
                            viewBox="0 0 24 24" 
                            fill={i < 4 ? '#c9595a' : 'none'} 
                            stroke="#c9595a"
                            strokeWidth="2"
                        >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                    ))} 
                    <p style={{color: '#c9595a'}}>(4)</p>
                </div>
                {/* Price and Cart */}
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium" style={{color: '#c9595a'}}>
                        {currency}{product.offerPrice} 
                        <span className="text-gray-500/60 md:text-sm text-xs line-through ml-2">
                            {currency}{product.price}
                        </span>
                    </p>
                    
                    <div onClick={(e) => {e.stopPropagation();}} style={{color: '#c9595a'}}>
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-1 border md:w-[80px] w-[64px] h-[34px] rounded font-medium" 
                                style={{
                                    backgroundColor: '#f9e6e6',
                                    borderColor: '#c9595a',
                                    color: '#c9595a'
                                }}
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart_icon"/>
                                Add
                            </button>
                        ) : (
                            <div 
                                className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] rounded select-none"
                                style={{backgroundColor: 'rgba(201, 89, 90, 0.15)'}}
                            >
                                <button 
                                    onClick={() => removeFromCart(product._id)} 
                                    className="cursor-pointer text-md px-2 h-full"
                                    style={{color: '#c9595a'}}
                                >
                                    -
                                </button>
                                <span className="w-5 text-center" style={{color: '#c9595a'}}>
                                    {cartItems[product._id]}
                                </span>
                                <button 
                                    onClick={() => addToCart(product._id)} 
                                    className="cursor-pointer text-md px-2 h-full"
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