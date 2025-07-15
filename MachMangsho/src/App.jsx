import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom' // <-- Add Routes here
import Home from './pages/Home' // <-- Import Home component
import Login from './components/Login'  // Add this import
import ProductCategory from './pages/ProductCategory' // <-- Import ProductCategory component

import { useAppContext } from './context/AppContext' // <-- Import AppContext
import { Toaster } from 'react-hot-toast' // <-- Import Toaster for notifications
import Footer from './components/Footer'
import AllProducts from './pages/AllProducts'
import ProductDetails from './pages/ProductDetails' // <-- Import ProductDetails component
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
const App = () => {


  const isSellerPath = window.location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext(); // <-- Use context to get showUserLogin state
  return (
  
    <div clasName='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login/> : null} {/* <-- Conditionally render Login component */}

      <Toaster/>
      <div className={`${
        isSellerPath ? "" : 'px-6 md:px-16 lg:px-24 xl:px-32'
      }`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>

          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App