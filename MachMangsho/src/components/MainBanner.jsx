import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt="Main Banner" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="Main Banner" className='w-full md:hidden' />
      
      {/* Add absolute positioning to place content over the images */}
      <div className='absolute inset-0 flex flex-col justify-center items-start pl-8 md:pl-16 space-y-4'>
        <h1 className='text-2xl md:text-4xl font-bold text-black max-w-md'>
          Freshness You Can Trust, Savings You will Love!
        </h1>
        
        <div className='flex flex-col md:flex-row gap-4'>
          <Link to="/products" className='group flex items-center gap-2 px-7 md:px-9 py-3 transition rounded text-white cursor-pointer' style={{ backgroundColor: '#c9595a' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#b14a4b'} onMouseLeave={(e) => e.target.style.backgroundColor = '#c9595a'}>
            Shop Now
            <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="Arrow" />
          </Link>
          
          <Link to="/products" className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-black transition' style={{ ':hover': { color: '#c9595a' } }} onMouseEnter={(e) => e.target.style.color = '#c9595a'} onMouseLeave={(e) => e.target.style.color = 'black'}>
            Explore deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="Arrow" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
