import React, { use } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user,setUser] = React.useState(null);
    const [isSeller,setIsSeller] = React.useState(null);

    
    const value ={navigate, user, setUser, isSeller, setIsSeller};
return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;   

}

export const useAppContext = () => {
    return use(AppContext);
}
