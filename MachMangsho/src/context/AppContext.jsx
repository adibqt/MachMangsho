import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

<<<<<<< HEAD
axios.defaults.withCredentials = true;
=======
axios.defaults.withCredentials = true; // Enable sending cookies with requests
>>>>>>> adib
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "৳"; // Currency from environment variable with fallback
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin] = useState(false);
    const [products,setProducts] = useState([]);

    const [cartItems,setCartItems] = React.useState({});
    const [searchQuery,setSearchQuery] = React.useState({});
    
<<<<<<< HEAD
    // Fetch Seller Status
    const fetchSeller = async ()=>{
        try {
            const{data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }
            else{
               setIsSeller(false) 
            }
        } catch (error) {
            setIsSeller(false) 
            
        }
    }


    // Fetch User Auth Status, User Data and Cart Items

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }
    
    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
=======
// Fetech Seller

const fetchSeller = async () => {
    try {
        const {data} = await axios.get('/api/seller/is-auth');
        if(data.success){
            setIsSeller(true);
            
        }else{
            setIsSeller(false);
        }
    } catch (error) {
        setIsSeller(false);
>>>>>>> adib
    }
}

// Logout Seller
const logoutSeller = async () => {
    try {
        const { data } = await axios.post('/api/seller/logout');
        setIsSeller(false);
        if (data?.success) {
            toast.success('Logged out successfully');
        }
    } catch (e) {
        setIsSeller(false);
    }
};

// Fetch User Auth Status, User Data and Cart Items
const fetchUser = async () => {
    try {
        const{data} = await axios.get('/api/user/is-auth');
        if(data.success){
            setUser(data.user);
            // Only set cart items from server if user has saved cart items
            if (data.user.cartItems && Object.keys(data.user.cartItems).length > 0) {
                setCartItems(data.user.cartItems);
            }
        } else {
            setUser(null);
        }
    } catch (error) {
        setUser(null);
    }
}


    const fetchProducts = async () => {
        try {
            const {data} = await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products);
            }else{
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Sync cart to backend for logged-in users; fallback to localStorage for guests
    const syncCart = async (nextCart) => {
        try {
            if (user?._id) {
                await axios.put('/api/cart/update', { cartItems: nextCart });
            } else {
                localStorage.setItem('cartItems', JSON.stringify(nextCart));
            }
        } catch (err) {
            // Non-blocking: keep UI responsive even if sync fails
            console.error('Cart sync failed:', err?.response?.data || err?.message);
            toast.error('Failed to save cart. Please try again.');
        }
    };

    // ADD Products to cart
    const addToCart = (itemID) => {
        const cartData = structuredClone(cartItems);
        cartData[itemID] = (cartData[itemID] || 0) + 1;
        setCartItems(cartData);
        syncCart(cartData);
        toast.success("Item added to cart");
    };

    const updateCartItem = (itemID, quantity) => {
        const cartData = structuredClone(cartItems);
        cartData[itemID] = quantity;
        if (cartData[itemID] <= 0) delete cartData[itemID];
        setCartItems(cartData);
        syncCart(cartData);
        toast.success("Cart updated successfully");
    };

    // remove item from cart
    const removeFromCart = (itemID) => {
        const cartData = structuredClone(cartItems);
        if (cartData[itemID]) {
            cartData[itemID] -= 1;
            if (cartData[itemID] <= 0) {
                delete cartData[itemID];
            }
        }
        setCartItems(cartData);
        syncCart(cartData);
        toast.success("Item removed from cart");
    };
    useEffect(() => {
        fetchSeller();
        fetchProducts();
    }, [])

    // Get Cart Items Count
    const getCartCount = ()=> {
        let totalCOunt =0;
        for(const item in cartItems){
            totalCOunt += cartItems[item];

        }
        return totalCOunt;

    }

    // Get Cart Total Price
    const getCartAmount = () => {
       let totalAmount =0;
       for(const items in cartItems){
        let itemInfo = products.find((product) => product._id === items);
        if(cartItems[items] > 0){
            totalAmount += itemInfo.offerPrice * cartItems[items];
        }
       }
       return Math.floor(totalAmount * 100) / 100; // Round to 2 decimal places

    }

     
<<<<<<< HEAD
    // Persist isSeller to localStorage whenever it changes
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  useEffect(() => {
    const updatedCartItems = async () => {
      try {
        const { data } = await axios.post('/api/user/update', { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    if(user){
        updatedCartItems();
    }    

  },[cartItems])

  const value = {navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin,products,currency,addToCart,updateCartItem, 
    removeFromCart, cartItems, fetchProducts, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, setCartItems};
=======
    // Initialize app data on mount
    useEffect(() => {
        const initializeApp = async () => {
            // Fetch user first to determine if logged in
            await fetchUser();
            await fetchSeller();
            await fetchProducts();
        };
        initializeApp();
    }, []);

    // Hydrate cart from localStorage for guests only, after user state is determined
    useEffect(() => {
        if (user === null) { // Explicitly null means we've determined user is not logged in
            const saved = localStorage.getItem('cartItems');
            if (saved) {
                try { 
                    const savedCart = JSON.parse(saved) || {};
                    setCartItems(savedCart);
                } catch {
                    setCartItems({});
                }
            }
        }
    }, [user]);

    // Refresh cart from server (useful after payments)
    const refreshCartFromServer = async () => {
        if (user?._id) {
            try {
                const { data } = await axios.get('/api/user/is-auth');
                if (data.success && data.user.cartItems) {
                    setCartItems(data.user.cartItems);
                } else {
                    setCartItems({});
                }
            } catch (error) {
                console.error('Failed to refresh cart:', error);
                setCartItems({});
            }
        }
    };

    const value = {navigate, user, setUser, isSeller, setIsSeller, logoutSeller, showUserLogin, setShowUserLogin,products,currency,addToCart,updateCartItem, 
        removeFromCart, cartItems, fetchProducts, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, setCartItems, refreshCartFromServer};
>>>>>>> adib
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;   

}

export const useAppContext = () => {
    return useContext(AppContext);  // Changed from use(AppContext) to useContext(AppContext)
}

