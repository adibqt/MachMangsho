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
            productsCopy = productsCopy.filter((item) => product.category === item.category);
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

    useEffect(() => {
        setThumbnail(product?.image?.[0] || null);
    }, [product]);

    if (!product) {
        return <div className="mt-12 text-center">Product not found</div>;
    }

    return (
        <div className="mt-12">
            <p>
                <Link to="/">Home</Link> /
                <Link to="/products"> Products</Link> / {/* Fixed link */}
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-indigo-500"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                           
                                <img src = {i<4 ? assets.star_icon : assets.star_dull_icon} alt = "Star Icon" className="mid: w-4 w-3.5"/>
                            
                        ))}
                        <p className="text-base ml-2">({4})</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP:{currency} {product.price}</p>
                        <p className="text-2xl font-medium">MRP:{currency} {product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={() => {addToCart(product._id); navigate("/cart");}} className="w-full py-3.5 cursor-pointer font-medium text-white hover:opacity-90 transition" style={{ backgroundColor: '#c9595a' }} >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-medium">Related Products</h2>
                        <button 
                            onClick={() => navigate('/products')} 
                            className="px-6 py-2 text-white font-medium rounded transition hover:opacity-90"
                            style={{ backgroundColor: '#c9595a' }}
                        >
                            See More
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard key={relatedProduct._id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;