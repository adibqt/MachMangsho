import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
//import Home from './pages/Home'

export const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {

    const currency = "৳"; // You can change this to any currency symbol you want
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [isSeller,setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin] = useState(false);
    const [products,setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Add this line
    const [cartItems,setCartItems] = React.useState({});
    
    const fetchProducts = async () => {
        setProducts(dummyProducts)
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
        fetchProducts();
    }, [])
    const value ={navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin,products,currency,addToCart,updateCartItem, 
        removeFromCart, cartItems, fetchProducts, searchQuery, setSearchQuery }; // Add searchQuery and setSearchQuery
return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;   

}

export const useAppContext = () => {
    return useContext(AppContext);  // Changed from use(AppContext) to useContext(AppContext)
}

