import React, { use } from 'react';
import { assets } from '../assets/assets'; // Add this import

const ProductCard = ({product}) => {
    const [count, setCount] = React.useState(0);
    const {currency} = useAppContext();

    

    return (
        <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        
                            <img key = {i} className = "md: w-3.5 w3"src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt=""/>
                        
                    ))} 
                    <p>(4)</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium" style={{color: '#c9595a'}}>
                       {currency} ${product.offerPrice}{""} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency} ${product.price}</span>
                    </p>
                    <div style={{color: '#c9595a'}}>
                        {count === 0 ? (
                            <button 
                                className="flex items-center justify-center gap-1 border md:w-[80px] w-[64px] h-[34px] rounded font-medium" 
                                style={{
                                    backgroundColor: '#f9e6e6',
                                    borderColor: '#c9595a',
                                    color: '#c9595a'
                                }}
                                onClick={() => setCount(1)}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#c9595a" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Add
                            </button>
                        ) : (
                            <div 
                                className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] rounded select-none"
                                style={{backgroundColor: 'rgba(201, 89, 90, 0.15)'}}
                            >
                                <button 
                                    onClick={() => setCount((prev) => Math.max(prev - 1, 0))} 
                                    className="cursor-pointer text-md px-2 h-full"
                                    style={{color: '#c9595a'}}
                                >
                                    -
                                </button>
                                <span className="w-5 text-center" style={{color: '#c9595a'}}>{count}</span>
                                <button 
                                    onClick={() => setCount((prev) => prev + 1)} 
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