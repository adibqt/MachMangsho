import React, { useState, useEffect, use } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyAddress, assets } from '../assets/assets';
import toast from 'react-hot-toast';



const Cart = () => {
    const {products, curency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems, setShowUserLogin } = useAppContext();
    const [cartArray, setCartArray] =useState([]);
    const defaultAddress = { street: 'street 123', city: 'Dhaka', state: '', country: 'Bangladesh' };
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");

    const getCart = ()=> {
        let tempArray =[];
        for(const key in cartItems){
            const product = products.find((item) => item._id === key);
            if (product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
        }
        setCartArray(tempArray);
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const placeOrder = async () => {
        try {
            // Check if user is logged in first
            if (!user) {
                toast.error("Please login first to place an order");
                setShowUserLogin(true); // Show login popup
                return;
            }

            if (!selectedAddress) {
                return toast.error("Please select a delivery address.");
                
            }
            // Place order with COD

        if(paymentOption === "COD"){
            const {data} = await axios.post('/api/order/cod', {
                userId: user._id,
                items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                address: selectedAddress._id
            });
            
            if(data.success){
                toast.success("Order placed successfully");
                setCartItems({});
                navigate('/my-orders');
            }else{
                toast.error(data.message);
            }
        }else {
            const {data} = await axios.post('/api/order/stripe', {
                userId: user._id,
                items: cartArray.map(item => ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id,
            })

            
            if(data.success){
                window.location.replace(data.url);
             
            } else {
                toast.error(data.message)
            }
                
            }
    } catch (error) {
        toast.error(error.message);
    }

    }

    useEffect(() => {
        if(products.length > 0 && cartItems) {
            getCart();

        }

        }, [products, cartItems]);

    useEffect(() => {
        if(user){
            getUserAddress();
        }

    },[user])
    return products.length > 0 && cartItems  ? (
        <div className="flex flex-col md:flex-row mt-16 gap-8">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium">
    Shopping <span className="relative inline-block">Cart
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c9595a] rounded-full"></span>
    </span>
    <span className="text-sm text-[#c9595a] font-semibold"> {getCartCount()} Items</span>
</h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=>{
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                scrollTo(0, 0);
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.images?.[0] || assets.upload_area} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={e=> updateCartItem(product._id, Number(e.target.value)) } value={cartItems[product._id]}
                                         className='outline-none'>
                                            {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{curency}{product.offerPrice * product.quantity}</p>
                        <button onClick={()=> removeFromCart(product._id)} className="cursor-pointer mx-auto">







                            <img src={assets.remove_icon} alt="remove" 
                            className="inline-block w-6 h-6"/>
                            
                        </button>
                    </div>)
                )}

                <button onClick={()=> {navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 bg-[#c9595a] hover:text-[#b14c4d] text-white font-medium px-6 py-2 rounded-full transition">






                   <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>

                
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 md:ml-auto">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-[#c9595a] hover:text-[#b14c4d] font-medium cursor-pointer transition">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, index)=> ( <p onClick={() =>{setSelectedAddress(address) ;setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                   {address.street}, {address.city}, {address.state}, {address.country}
                                </p>)) }
                                <p onClick={() => navigate("/add-address")} className="text-[#c9595a] hover:text-[#b14c4d] text-center cursor-pointer p-2 font-medium transition">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e => setPaymentOption(e.target.value) } className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{curency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span style={{ color: '#c9595a' }}>Delivery Charge</span><span style={{ color: '#c9595a' }}>{curency}40</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span style={{ color: '#c9595a' }}>Total Amount:</span><span style={{ color: '#c9595a' }}>{curency}{getCartAmount() + 40}</span>
                    </p>
                </div>

                {!user && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-yellow-800 text-sm font-medium">
                                Please login to your account to place an order
                            </span>
                        </div>
                    </div>
                )}

                <button 
                    onClick={placeOrder} 
                    className={`w-full py-3 mt-6 cursor-pointer font-medium transition ${
                        !user 
                            ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                            : 'bg-[#c9595a] hover:bg-[#b14c4d] text-white'
                    }`}
                >
                    {!user 
                        ? "Login to Place Order" 
                        : paymentOption === "COD" 
                            ? "Place Order (COD)" 
                            : "Proceed to Payment"
                    }
                </button>
            </div>
        </div>
    ) : null
}

export default Cart;