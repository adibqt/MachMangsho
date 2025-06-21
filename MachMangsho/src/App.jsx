import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom' // <-- Add Routes here
import Home from './pages/Home' // <-- Import Home component
const App = () => {
  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 '>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
