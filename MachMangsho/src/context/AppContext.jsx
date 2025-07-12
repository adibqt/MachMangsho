import React, { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {

    const currency = "৳"; // You can change this to any currency symbol you want
    const navigate = useNavigate();
    const [user,setUser] = React.useState(null);
    const [isSeller,setIsSeller] = React.useState(null);
    const [showUserLogin,setShowUserLogin] = React.useState(false);
    const [products,setProducts] = React.useState([]);

    const [cartItems,setCartItems] = React.useState({});
    
    const fetchProducts = async () => {
        setProducts(dummyProducts)
    }

    // ADD Products to cart
    const addToCart = () => {
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
        toast.success("Item removed from cart");
    }
    useEffect(() => {
        fetchProducts();
    }, [])
    const value ={navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin,products,currency,addToCart,updateCartItem, 
        removeFromCart, cartItems, fetchProducts };
return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;   

}

export const useAppContext = () => {
    return use(AppContext);
}
