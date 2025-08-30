import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt="Main Banner" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="Main Banner" className='w-full md:hidden' />
      
      {/* Add absolute positioning to place content over the images */}
      <div className='absolute inset-0 flex flex-col justify-center items-start pl-8 md:pl-16 space-y-10'>
        <h1 className='text-3xl md:text-5xl font-bold text-black max-w-md'>
          Freshness You Can Trust, Savings You will Love!
        </h1>
        
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Primary CTA: go to all products */}
          <Link
            to="/products"
            aria-label="Browse all products"
            className='group flex items-center gap-2 px-7 md:px-9 py-3 transition rounded text-white cursor-pointer'
            style={{ backgroundColor: '#c9595a' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b14a4b')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c9595a')}
          >
            Shop Now
            <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="" />
          </Link>

          {/* Secondary CTA: deep-link to deals (e.g., offerPrice < price) */}
          <Link
            to={{ pathname: '/products', search: '?filter=deals' }}
            aria-label="View current deals"
            className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-black transition'
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9595a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'black')}
          >
            Explore Deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
