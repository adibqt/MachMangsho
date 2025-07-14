import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom' // <-- Add Routes here
import Home from './pages/Home' // <-- Import Home component

import { useAppContext } from './context/AppContext' // <-- Import AppContext
import { Toaster } from 'react-hot-toast' // <-- Import Toaster for notifications
import Footer from './components/Footer'
const App = () => {

  const isSellerPath = window.location.pathname.includes("seller");
  return (
  
    <div>
      {isSellerPath ? null : <Navbar />}

      <Toaster/>
      <div className={`${
        isSellerPath ? "" : 'px-6 md:px-16 lg:px-24 xl:px-32'
      }`}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App