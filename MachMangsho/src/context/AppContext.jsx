import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [isSeller, setIsSeller] = React.useState(null);
    const [showUserLogin, setShowUserLogin] = React.useState(false);
    
    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext); // Correctly use React.useContext
};
