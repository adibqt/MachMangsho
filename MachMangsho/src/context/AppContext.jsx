import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
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
    }

    // ADD Products to cart
    const addToCart = (itemID) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemID]){
            cartData[itemID] += 1;
        }else{
            cartData[itemID] = 1;
        }

        setCartItems(cartData);
        toast.success("Item added to cart");
    }

    const updateCartItem = (itemID, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemID] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated successfully");
    
    }

    // remove item from cart
    const removeFromCart = (itemID) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemID]){
            cartData[itemID] -= 1;
            if(cartData[itemID] <= 0){
                delete cartData[itemID];
            }
    }
        setCartItems(cartData);
        toast.success("Item removed from cart");
    }
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
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;   

}

export const useAppContext = () => {
    return useContext(AppContext);  // Changed from use(AppContext) to useContext(AppContext)
}